
import { map, T, ap, memoizeWith, toLower, last, reduce, omit, toPairs, append, flip, includes, mergeLeft, chain, always, path, split, equals, test, prop, applySpec, cond, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse, lt, converge } from 'ramda'
const userSelectKeys = ['salary', 'jobType', 'mainFunctions', 'jobFunctions', 'functionTitles', 'qualification', 'workExperience','verifiedCompany']
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
        filterParamsObject: identity
    })],
    [conditions.onlyOneFunctionTitle, params => buildQueryParams({
        ...params,
        fucntionTitles: [],
        query: params.fucntionTitles[0]
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


export const encode = buildQueryParams