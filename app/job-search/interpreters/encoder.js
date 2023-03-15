
import { map, T, ap, memoizeWith, toLower, last, reduce, omit, toPairs, append, flip, includes, mergeLeft, chain, always, path, split, equals, test, prop, applySpec, cond, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse, lt, converge } from 'ramda'
import slugify from 'slugify'
const userSelectKeys = ['salary', 'jobType', 'mainFunctions', 'jobFunctions', 'functionTitles', 'qualification', 'workExperience', 'verifiedCompany']
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
// const lastKeyIn = keys => pipe(allKeysIn(keys), last)
const conditions = {
    noParams: pipe(allKeysIn(['query', 'location', ...userSelectKeys]), isEmpty),
    onlyOneFunctionTitle: both(onlyOneIn(['query', ...userSelectKeys]), onlyOneIn(['functionTitles'])),
    onlyOne: onlyOneIn(['query', 'location', ...userSelectKeys]),
    oneWithLocation: both(
        onlyOneIn(['query', ...userSelectKeys]),
        has('location')
    ),
    queryMany: both(
        has('query'),
        pipe(totalOf(['query', 'location', ...userSelectKeys]), lte(2))
    ),
    noQueryMany: both(
        no('query'),
        pipe(totalOf(['location', ...userSelectKeys]), lte(2))
    )
}
const buildQueryParams = cond([
    [conditions.noParams, applySpec({
        searchQuery: always('job-search'),
        params: identity
    })],
    [conditions.onlyOneFunctionTitle, params => buildQueryParams({
        ...params,
        fucntionTitles: [],
        query: params.functionTitles[0]
    })],
    [conditions.onlyOne, applySpec({
        searchQuery: pipe(
            firstKeyIn(['query', 'location', ...userSelectKeys]),
            key => key + '-jobs'
        ),
        params: { page: either(prop('page'), always(1)) }
    })],
    [conditions.oneWithLocation, applySpec({
        searchQuery: pipe(
            juxt([firstKeyIn(['query', ...userSelectKeys]), prop('location')]),
            join('-jobs-in-')
        ),
        params: { page: either(prop('page'), always(1)) }
    })],
    [conditions.queryMany, applySpec({
        searchQuery: pipe(prop('query'), key => key + '-jobs'),
        params: dissoc('query')
    })],
    [conditions.noQueryMany, applySpec({
        searchQuery: always('job-search'),
        params: identity
    })]
])

const washData = pipe(
    // filter(complement(either(isNil, isEmpty))),
    toLower,
    slugify,
)

const configItems = applySpec({
    location: pipe(path(['inputs', 'location_lists']), chain(prop('locations'))),
    jobType: pipe(path(['inputs', 'job_types'])),
    salary: pipe(path(['filters', 'salary_range_filters'])),
    workExperience: pipe(path(['inputs', 'xp_lvls'])),
    // industry: pipe(path(['inputs', 'industry_lists'])),
    qualification: pipe(path(['filters', 'educations'])),
    mainFunctions: pipe(path(['inputs', 'main_functions'])),
    jobFunctions: pipe(path(['inputs', 'job_functions'])),
    functionTitles: pipe(path(['inputs', 'function_titles'])),
})

const configKeys = pipe(configItems, map(
    map(ifElse(has('seo-value'),
        prop('seo-value'),
        ifElse(has('function_title_value'),
            prop('function_title_value'),
            prop('seo_value'))))))

const keywordMatches = pipe(
    configKeys,
    dissoc('functionTitles'),
    toPairs,
    map(([key, list]) => [flip(includes)(list), applySpec({ [key]: identity })]),
    append([T, applySpec({ query: identity })]),
    cond
)

const parseKeywordParams = config => pipe(
    keywordParser,
    map(keywordMatches(config)),
    reduce(mergeLeft, {})
)

const keywordParser = pipe(toLower, cond([
    [test(/((\B|\b)-jobs-in-\b)/g), split('-jobs-in-')],
    [test(/((\B|\b)-jobs\b)/g), pipe(split('-jobs'), dropLast(1))],
    [equals('job-search'), always([])],
    [T, always([])]
]))

export const encode = pipe(
    filter(complement(either(isNil, isEmpty))),
    map(
        ifElse(is(Array), map(washData), washData)
    ), buildQueryParams)

export const decoder = config => (path, params) => mergeLeft(
    parseKeywordParams(config)(path),
    params
)