
import { unslugify } from '../../../../helpers/formatter'
import { map, pick, T, toLower, mergeDeepLeft, reduce, toPairs, append, flip, includes, mergeLeft, chain, always, path, split, equals, test, prop, applySpec, cond, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse } from 'ramda'
import { flatMap } from 'lodash-es'
// import slugify from 'slugify'
const userSelectKeys = ['salary', 'jobType', 'mainFunctions', 'jobFunctions', 'functionTitles', 'qualification', 'queryFields']
const normalKeys = ['verifiedCompany', 'companySizes', 'workExperience', 'financingStages', 'industry']
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
        functionTitles: [],
        query: dropLast(1)(params.functionTitles[0].split('-')).join('-')
    })],
    [conditions.onlyOne, applySpec({
        searchQuery: pipe(
            firstKeyIn(['query', 'location', ...userSelectKeys]),
            key => key + '-jobs'
        ),
        params: { page: either(prop('page'), always(1)), sort: either(prop('sort'), always('1')) }
    })],
    [conditions.oneWithLocation, applySpec({
        searchQuery: pipe(
            juxt([firstKeyIn(['query', ...userSelectKeys]), prop('location')]),
            join('-jobs-in-')
        ),
        params: { page: either(prop('page'), always(1)), sort: either(prop('sort'), always('1')) }
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
    encodeURIComponent,
    // slugify,
)

const configItems = applySpec({
    location: pipe(path(['location_lists']), chain(prop('locations'))),
    jobType: pipe(path(['job_types'])),
    salary: pipe(path(['salary_range_filters'])),
    workExperience: pipe(path(['xp_lvls'])),
    // industry: pipe(path(['inputs', 'industry_lists'])),
    qualification: pipe(path(['educations'])),
    mainFunctions: pipe(path(['main_functions'])),
    jobFunctions: pipe(path(['job_functions'])),
    functionTitles: pipe(path(['function_titles'])),
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
    map(([key, list]) => [flip(includes)(list), applySpec({ [key]: Array.of })]),
    append([T, applySpec({ query: unslugify })]),
    cond
)

const normalParams = pick(normalKeys)

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

export const encode = params => pipe(
    filter(complement(either(isNil, isEmpty))),
    map(
        ifElse(is(Array), map(washData), washData)
    ),
    buildQueryParams,
    result => {
        const moreParams = normalParams(params)
        return { ...result, params: { ...result.params, ...moreParams } }
    }
)(params)

export const decoder = config => (path, params) => mergeDeepLeft(
    parseKeywordParams(config)(decodeURIComponent(path)),
    map(ifElse(is(String), split(','), identity))(params)
)
export const firstUpper = tmp => tmp.charAt(0).toUpperCase() + tmp.slice(1)
export const buildValue = seo => {
    return seo.split('_').map(firstUpper).join(' ')
}
export const transToValues = seos => seos ? seos.map(buildValue).join(',') : null
export const thousandsToNumber = (string) => {
    if (string !== 'Above 100K') {
        const number = parseInt(string?.split?.('K')?.[0], 10)
        return number * 1000
    } else {
        return 100001
    }
}
export const handleSalary = (salaryRanges=[], salaryList) => {
    const selected = salaryRanges.map(seo => salaryList.find(item => item['seo-value'] === seo))
    const from = selected.map(item => item.from).join(',')
    const to = selected.map(item => item.to).join(',')
    return [from, to]
    // let salaryFrom = ''
    // let salaryTo = ''
    // if (salaryRanges?.length) {
    //     salaryFrom = salaryRanges
    //         .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
    //         .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split('-')[0]))

    //     salaryTo = salaryRanges
    //         .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
    //         .map((salaryTo) => thousandsToNumber('' + salaryTo.split('-')[1]))

    //     if (salaryRanges.includes('below-30k')) {
    //         salaryFrom.push(0)
    //         salaryTo.push(30000)
    //     }
    //     if (salaryRanges.includes('above-200k')) {
    //         salaryFrom.push(200001)
    //         salaryTo.push(400000)
    //     }
    //     salaryFrom = salaryFrom.join(',')
    //     salaryTo = salaryTo.join(',')
    // }
    // return [salaryFrom, salaryTo]
}
export const buildParams = (config, searchValues) => {
    const industryList = config.industry_lists
    const functionsTitleList = config.function_titles
    const jobFunctionList = config.job_functions
    const mainFunctionList = config.main_functions
    const companySizeList = config.company_sizes
    const qualificationList = config.educations
    const financingStagesList = config.company_financing_stage_lists
    const salaryList = config.salary_range_filters
    const [salaryFrom, salaryTo] = handleSalary(searchValues.salary, salaryList)
    const workExperienceList = config.xp_lvls
    const jobTypeList = config.job_types
    const locationLists = flatMap(config.location_lists, item => item.locations)
    const queryFields = searchValues?.queryFields?.join(',') || "job_title,company_name"
    return {
        query: searchValues.query,
        query_fields: queryFields === 'company' ? 'company_name' : queryFields,
        company_industries: searchValues.industry?.map?.(key => industryList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        job_location_ids: searchValues.location?.map?.(key => locationLists.find(item => item?.['seo_value'] === key)?.id).join(',') ?? null,
        salary_from: salaryFrom,
        salary_to: salaryTo,
        job_type_ids: searchValues.jobType?.map?.(key => jobTypeList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
        xp_lvl_ids: searchValues.workExperience?.map?.(key => workExperienceList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
        degree_ids: searchValues.qualification?.map?.(key => qualificationList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
        company_financing_stage_ids: searchValues.financingStages?.map?.(key => financingStagesList.find(item => item?.key === key)?.id).join(',') ?? null,
        is_company_verified: searchValues.verifiedCompany  ? Boolean(searchValues.verifiedCompany) : null,
        job_functions_ids: searchValues?.jobFunctions?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
        main_job_function_ids: searchValues?.mainFunctions?.map?.(seo => mainFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
        company_size_ids: searchValues.companySizes?.map?.(key => companySizeList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
        function_job_title_ids: searchValues?.functionTitles?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)
            ?.join?.(',') ?? null,
        page: searchValues?.page?.[0] ?? 1,
        size: 15,
        source: 'web',
        sort:searchValues?.sort?.join(),
    }
}