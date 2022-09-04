import { map, T, ap, values, memoizeWith, flatten, last, reduce, omit, toPairs, append, mergeLeft, chain, always, path, split, equals, test, prop, applySpec, cond, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse, lt, converge } from 'ramda'
const userSelectKeys = ['salary', 'jobType', 'category', 'industry', 'qualification', 'workExperience']
const no = propSatisfies(either(isEmpty, isNil))
const has = complement(no)
const allKeysIn = keys => pipe(
    juxt(keys.map(key => prop(key))),
    filter(complement(either(isEmpty, isNil))),
    map(when(is(Array), join(','))),
    join(','), split(','),
    filter(complement(either(isEmpty, isNil)))
)
const totalOf = keys => pipe(allKeysIn(keys), prop('length'))
const onlyOneIn = keys => pipe(totalOf(keys), equals(1))
const firstKeyIn = keys => pipe(allKeysIn(keys), prop(0))
const lastKeyIn = keys => pipe(allKeysIn(keys), last)

const checkFilterMatchFunc = (routerQuery, config, isMobile = false) => {
    console.log("checkFilterMatchFunc invoked!!!!")

    return pipe(ap([
        pipe(buildMatchedConfigs(config), dissoc('matchedConfig')),
        pipe(parseKeywordParams(config), converge(mergeLeft, [
            pipe(allKeysIn(['location']), applySpec({
                predefinedLocation: when(is(Array), join(',')),
            })),
            pipe(allKeysIn(userSelectKeys), applySpec({
                searchMatch: complement(either(isEmpty, isNil)),
            }))
        ])),
        pipe(parseFullParams(config), applySpec({
            predefinedQuery: either(
                pipe(parseKeywordParams(config), allKeysIn(userSelectKeys), when(is(Array), join(','))),
                either(lastKeyIn(['category']), always('')))
        })),
        pipe(parseFullParams(config), applySpec({
            matchedLocation: pipe(
                prop('location'),
                locationkey => configItems(config).location.filter(location => location['seo_value'] === locationkey),
                ifElse(either(isEmpty, isNil), always({}), applySpec({
                    location: identity
                }))
            ),
            locationMatch: pipe(prop('location'), complement(either(isEmpty, isNil))),
        })),
        pipe(prop('keyword'), keywordParser, prop(0), keywordMatches(config), applySpec({
            searchQuery: [prop('query'), prop('location'), always('')].reduce(either)
        })),
        applySpec({
            filterCount: totalOf(isMobile ? userSelectKeys : ['industry', 'workExperience', 'qualification'])
        })]), reduce(mergeLeft, {}))([routerQuery])
}

export const checkFilterMatch = memoizeWith((routerQuery, config, isMobile = false) => {
    return toPairs(routerQuery).map(join('')).join('') + isMobile
}, checkFilterMatchFunc)

export const userFilterSelectionDataParser = (field, optionValue, routerQuery, config, isClear) => {
    const match = keywordMatchConfigItem(configItems(config).salary)('below 30k')
    console.log('match', match)
    return pipe(
        parseFullParams(config),
        mergeLeft(parseIncrement(config)(field)(optionValue)),
        filter(complement(either(isEmpty, isNil))),
        dissoc('keyword'),
        when(() => is(Array)(isClear), omit(isClear)),
        converge(mergeLeft, [
            buildQueryParams,
            applySpec({
                newParams: pipe(
                    dissoc('page'), 
                    values, 
                    flatten, 
                    join(','), 
                    split(','),
                    itemFilter(config)
                    )
            })
        ])
    )(routerQuery)
    // return converge(mergeLeft, [
    //     pipe(
    //         parseFullParams(config),
    //         mergeLeft(parseIncrement(config)(field)(optionValue)),
    //         filter(complement(either(isEmpty, isNil))),
    //         dissoc('keyword'),
    //         when(() => is(Array)(isClear), omit(isClear)),
    //         buildQueryParams,

    //     ),
    //     pipe(
    //         mergeLeft(parseIncrement(config)(field)(optionValue)),
    //         when(() => is(Array)(isClear), omit(isClear)),
    //         buildMatchedConfigs(config)
    //     )
    // ])(routerQuery)
}

const conditions = {
    noParams: pipe(allKeysIn(['query', 'location', ...userSelectKeys]), isEmpty),
    onlyOne: onlyOneIn(['query', 'location', ...userSelectKeys]),
    oneWithLocation: both(
        onlyOneIn(['query', ...userSelectKeys]),
        has('location')
    ),
    queryMany: both(
        has('query'),
        pipe(totalOf(['location', ...userSelectKeys]), lte(2))
    ),
    noQueryMany: both(
        no('query'),
        pipe(totalOf(['location', ...userSelectKeys]), lte(2))
    )
}

const buildQueryParams = cond([
    [conditions.noParams, applySpec({
        searchQuery: always('job-search'),
        filterParamsObject: identity
    })],
    [conditions.onlyOne, applySpec({
        searchQuery: pipe(
            firstKeyIn(['query', 'location', ...userSelectKeys]),
            key => key + '-jobs'
        ),
        filterParamsObject: { page: either(prop('page'), always(1)) }
    })],
    [conditions.oneWithLocation, applySpec({
        searchQuery: pipe(
            juxt([firstKeyIn(['query', ...userSelectKeys]), prop('location')]),
            join('-jobs-in-')
        ),
        filterParamsObject: { page: either(prop('page'), always(1)) }
    })],
    [conditions.queryMany, applySpec({
        searchQuery: pipe(prop('query'), key => key + '-jobs'),
        filterParamsObject: dissoc('query')
    })],
    [conditions.noQueryMany, applySpec({
        searchQuery: always('job-search'),
        filterParamsObject: identity
    })]
])

const buildMatchedConfigs = config => applySpec({
    matchedConfig: {},
    matchedConfigFromUrl: pipe(prop('keyword'), keywordParser, itemFilter(config)),
    matchedConfigFromUserSelection: pipe(allKeysIn(userSelectKeys), itemFilter(config))
})

const parseIncrement = config => cond([
    [equals('location'), field => applySpec({ [field]: prop('seo_value') })],
    [equals('moreFilters'), () => pipe(obj =>
        Object.keys(obj)
            .filter(key => ['category', 'page', ...userSelectKeys].includes(key))
            .map(key => ({ [key]: obj[key] }))
            .reduce(mergeLeft, {}),
        filter(complement(either(isEmpty, isNil))),
        map(when(is(Array), pipe(filter(identity), join(',')))),
        filter(identity)
    )],
    [equals('query'), field => either(keywordMatches(config), applySpec({ [field]: identity }))],
    [T, field => applySpec({ [field]: identity })]
])

const parseFullParams = config =>
    pipe(
        converge(mergeLeft, [parseKeywordParams(config), identity]),
        map(when(is(Array), join(',')))
    )

const configItems = applySpec({
    location: pipe(path(['inputs', 'location_lists']), chain(prop('locations'))),
    jobType: pipe(path(['inputs', 'job_types'])),
    salary: pipe(path(['filters', 'salary_range_filters'])),
    workExperience: pipe(path(['inputs', 'xp_lvls'])),
    industry: pipe(path(['inputs', 'industry_lists'])),
    qualification: pipe(path(['filters', 'educations'])),
    category: pipe(path(['inputs', 'job_category_lists']), chain(cate => [cate, ...cate.sub_list]))
})

const itemFilter = config => keys => pipe(
    configItems,
    map(items => items.filter(item => keys.includes(item['seo-value']) || keys.includes(item['seo_value']))),
    filter(pipe(prop('length'), lt(0)))
)(config)

const keywordMatchConfigItem = list => keyword => list?.filter?.(item =>
    [item['seo-value'], item['seo_value'], item.value.toLowerCase()].filter(a => a)
        .includes(keyword?.toLowerCase?.()))

const keywordMatches = pipe(
    configItems,
    toPairs,
    map(([key, list]) => [
        pipe(keywordMatchConfigItem(list), complement(either(isEmpty, isNil))),
        applySpec({
            [key]: pipe(
                keywordMatchConfigItem(list),
                either(path([0, 'seo-value']), path([0, 'seo_value'])))
        })
    ]),
    append([T, applySpec({ query: identity })]),
    cond
)
const parseKeywordParams = config =>
    pipe(
        prop('keyword'),
        keywordParser,
        map(keywordMatches(config)),
        reduce(mergeLeft, {})
    )
const keywordParser = cond([
    [test(/((\B|\b)-jobs-in-\b)/g), split('-jobs-in-')],
    [test(/((\B|\b)-jobs\b)/g), pipe(split('-jobs'), dropLast(1))],
    [equals('job-search'), always([])],
    [T, always([])]
])