
import { unslugify } from '../../../helpers/formatter'
import { map, pick, T, toLower, mergeDeepLeft, reduce, toPairs, append, flip, includes, mergeLeft, chain, always, path, split, equals, test, prop, applySpec, cond, identity, dropLast, isEmpty, propSatisfies, isNil, complement, either, both, juxt, join, filter, lte, pipe, dissoc, when, is, ifElse } from 'ramda'
import { flatMap } from 'lodash-es'
import slugify from 'slugify'
const userSelectKeys = ['salary', 'jobType', 'mainFunctions', 'jobFunctions', 'functionTitles', 'qualification']
const normalKeys = ['verifiedCompany', 'companySizes', 'workExperience', 'financing_stages', 'industry']
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
    parseKeywordParams(config)(path),
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
export const handleSalary = (salaryRanges) => {
    let salaryFrom = ''
    let salaryTo = ''
    if (salaryRanges?.length) {
        salaryFrom = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split('-')[0]))

        salaryTo = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryTo) => thousandsToNumber('' + salaryTo.split('-')[1]))

        if (salaryRanges.includes('below-30k')) {
            salaryFrom.push(0)
            salaryTo.push(30000)
        }
        if (salaryRanges.includes('above-200k')) {
            salaryFrom.push(200001)
            salaryTo.push(400000)
        }
        salaryFrom = salaryFrom.join(',')
        salaryTo = salaryTo.join(',')
    }
    return [salaryFrom, salaryTo]
}
export const buildParams = (config, searchValues) => {
    const industryList = config.inputs.industry_lists
    const functionsTitleList = config.inputs.function_titles
    const jobFunctionList = config.inputs.job_functions
    const mainFunctionList = config.inputs.main_functions
    const companySizeList = config.inputs.company_sizes
    const qualificationList = config.filters.educations
    const financingStagesList = config.inputs.company_financing_stage_lists
    const [salaryFrom, salaryTo] = handleSalary(searchValues.salary)
    const workExperienceList = config.inputs.xp_lvls
    const jobTypeList = config.inputs.job_types
    const locationLists = flatMap(config.inputs.location_lists, item => item.locations)
    return {
        query: searchValues.query,
        company_industries: searchValues.industry?.map?.(key => industryList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        // job_locations: transToValues(searchValues.location),
        job_locations: searchValues.location?.map?.(key => locationLists.find(item => item?.['seo_value'] === key)?.value).join(',') ?? null,
        salary_from: salaryFrom,
        salary_to: salaryTo,
        job_types: searchValues.jobType?.map?.(key => jobTypeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        xp_lvls: searchValues.workExperience?.map?.(key => workExperienceList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        degrees: searchValues.qualification?.map?.(key => qualificationList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        company_financing_stages: searchValues.financingStages?.map?.(key => financingStagesList.find(item => item?.key === key)?.value).join(',') ?? null,
        is_company_verified: Boolean(searchValues.verifiedCompany),
        job_functions_ids: searchValues?.jobFunctions?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
        main_functions: searchValues?.mainFunctions?.map?.(seo => mainFunctionList.find(item => item.seo_value === seo)?.value)?.join?.(',') ?? null,
        company_sizes: searchValues.companySizes?.map?.(key => companySizeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
        function_job_title_ids: searchValues?.functionTitles?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)
            ?.join?.(',') ?? null,
        page: searchValues?.page?.[0] ?? 1,
        size: 15,
        source: 'web'
    }
}