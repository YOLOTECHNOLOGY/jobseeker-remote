import { map, T, omit, mergeLeft, chain, reduce, flip, always, path, toPairs, split, equals, test, append, prop, applySpec, cond, includes, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse, lt, mergeRight, converge } from 'ramda'
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

const build = (field, optionValue, routerQuery, config, isClear) => pipe(
    converge(mergeLeft, [
        pipe(
            parseFullParams(config),
            mergeLeft(parseIncrement(field)(optionValue)),
            filter(complement(either(isEmpty, isNil))),
            dissoc('keyword'),
            when(() => is(Array)(isClear), omit(isClear)),
            buildQueryParams,

        ),
        pipe(
            mergeLeft(parseIncrement(field)(optionValue)),
            when(() => is(Array)(isClear), omit(isClear)),
            buildMatchedConfigs(config)
        )
    ])
)(routerQuery)

const conditions = {
    noParams: ['query', 'location', ...userSelectKeys].map(key => no(key)).reduce(both),
    onlyOne: onlyOneIn(['query', 'location', ...userSelectKeys]),
    oneWithLocation: [onlyOneIn(['query', ...userSelectKeys]), has('location')].reduce(both),
    queryMany: [has('query'), pipe(totalOf(['location', ...userSelectKeys]), lte(2))].reduce(both),
    noQueryMany: [no('query'), pipe(totalOf(['location', ...userSelectKeys]), lte(2))].reduce(both),
}

const buildQueryParams = cond([
    [conditions.noParams,
    applySpec({
        searchQuery: always(undefined),
        filterParamsObject: identity
    })],
    [conditions.onlyOne,
    applySpec({
        searchQuery: pipe(
            firstKeyIn(['query', 'location', ...userSelectKeys]),
            key => key + '-jobs'
        ),
        filterParamsObject: { page: prop('page') }
    })],
    [conditions.oneWithLocation,
    applySpec({
        searchQuery: pipe(
            juxt([firstKeyIn(['query', ...userSelectKeys]), prop('location')]),
            join('-jobs-in-')
        ),
        filterParamsObject: { page: prop('page') }
    })],
    [conditions.queryMany,
    applySpec({
        searchQuery: pipe(prop('query'), key => key + '-jobs'),
        filterParamsObject: dissoc('query')
    })],
    [conditions.noQueryMany,
    applySpec({
        searchQuery: always('job-search'),
        filterParamsObject: identity
    })]
])

const buildMatchedConfigs = config => applySpec({
    matchedConfig: {},
    matchedConfigFromUrl: pipe(prop('keyword'), keywordParser, itemFilter(config)),
    matchedConfigFromUserSelection: pipe(allKeysIn(userSelectKeys), itemFilter(config))
})

const parseIncrement = cond([
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
    [T, field => applySpec({ [field]: identity })]
])

const parseFullParams = config => routerQuery =>
    pipe(
        prop('keyword'),
        keywordParser,
        map(keywordMatches(config)),
        reduce(mergeRight, routerQuery),
        filter(complement(either(isEmpty, isNil))),
        map(when(is(Array), join(',')))
    )(routerQuery)

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
    map(items => items.filter(item => keys.includes(item['seo-value'] || keys.includes['seo_value']))),
    filter(pipe(prop('length'), lt(0)))
)(config)

const configKeys = pipe(configItems, map(map(ifElse(has('seo-value'), prop('seo-value'), prop('seo_value')))))

const keywordMatches = pipe(
    configKeys,
    toPairs,
    map(([key, list]) => [flip(includes)(list), applySpec({ [key]: identity })]),
    append([T, applySpec({ query: identity })]),
    cond
)
const keywordParser = cond([
    [test(/((\B|\b)-jobs-in-\b)/g), split('-jobs-in-')],
    [test(/((\B|\b)-jobs\b)/g), pipe(split('-jobs'), dropLast(1))],
    [equals('job-search'), always([])]
])

export default build