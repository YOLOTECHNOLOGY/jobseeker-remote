import { flat, unslugify } from 'helpers/formatter'
import { checkFilterMatch, mapSeoValueToGetValue } from 'helpers/jobPayloadFormatter'
import { put, takeLatest, select, delay, take, race } from 'redux-saga/effects'
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchConfigRequest, fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'
import { setJobHiredDefaultValue } from 'store/actions/jobs/jobHiredDefaultValues'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { initialState } from 'store/reducers/config/fetchConfig'
import { FETCH_CONFIG_SUCCESS } from 'store/types/config/fetchConfig'
// import { FETCH_CONFIG_SUCCESS } from 'store/types/config/fetchConfig'

function* jobHiredServerSide(action) {
    try {
        yield put(fetchConfigRequest())
        // yield race({
        //     config: take(FETCH_CONFIG_SUCCESS),
        //     default: delay(200)
        // })
        const config = yield select(store => store.config.config.response)
        const accessToken = action.accessToken
        const { defaultValues, payload: initPayload } = initPagePayLoad(action.payload, config)
        const { searchQuery, predefinedQuery, predefinedLocation } = checkFilterMatch(action.payload, config)
        yield put(setJobHiredDefaultValue({ searchQuery, predefinedQuery, predefinedLocation, defaultValues }))
        yield put(fetchJobsListRequest(initPayload, accessToken))
        if (accessToken) {
            yield put(fetchUserOwnDetailRequest({ accessToken }))
        }
        yield put(fetchFeaturedCompaniesListRequest({ size: 21, page: 1 }))
        yield put(fetchConfigSuccess(initialState.response))
    } catch (error) {
        console.log({ error })
    }
}

export default function* watchJobHiredServerSide() {
    yield takeLatest('JOB_HIRED_SERVER_SIDE', jobHiredServerSide)
}

export const initPagePayLoad = (query, config) => {
    const { page, industry, workExperience, category, jobType, salary, location, qualification, verifiedCompany } =
        query


    const formatLocationConfig = (locationList) => {
        const locationConfig = locationList?.map((region) => region.locations)
        return locationConfig
    }
    const industryList = config.inputs.industry_lists
    const expLvlList = config.inputs.xp_lvls
    const eduLevelList = config.filters.educations
    const locationList = config.inputs.location_lists
    const formattedLocationList = flat(formatLocationConfig(locationList))
    const catList = config && config.inputs && config.inputs.job_category_lists
    const jobTypeList = config.inputs.job_types
    const salaryRangeList = config.filters.salary_range_filters
    const mainFunctionList = config.inputs.main_functions
    const jobFunctionList = config.inputs.job_functions
    const functionsTitleList = config.inputs.function_titles
    // query parameters
    const queryJobType = query?.jobType
    const querySalary = query?.salary
    const queryQualification = query?.qualification
    const queryLocation = query?.location
    const queryIndustry = query?.industry
    const queryWorkExp = query?.workExperience
    const queryCategory = query?.category
    const queryVerifiedCompany = query?.verifiedCompany

    const { searchQuery, matchedLocation, matchedConfigFromUrl } = checkFilterMatch(query, config)

    const defaultValues = {
        urlQuery: searchQuery,
        // if sort param exist, follow sort defined in param, otherwise if search exist, sort default to 2 'Relevance'
        sort: query?.sort ? query?.sort : searchQuery ? 2 : 1,
        jobType: queryJobType?.split?.(',') || null,
        salary: querySalary?.map? querySalary : querySalary?.split?.(',') || null,
        qualification: queryQualification?.map? queryQualification : queryQualification?.split?.(',') || null,
        location: queryLocation?.split?.(',') || null,
        industry:queryIndustry?.map? queryIndustry : queryIndustry?.split?.(',') || null,
        workExperience:queryWorkExp?.map? queryWorkExp : queryWorkExp?.split?.(',') || null,
        category: queryCategory?.map? queryCategory : queryCategory?.split?.(',') || null,
        verifiedCompany: queryVerifiedCompany?.map? queryVerifiedCompany : queryVerifiedCompany?.split?.(',') || null,
        mainFunctions: query?.mainFunctions?.map? query?.mainFunctions : query?.mainFunctions?.split?.(',') ?? null,
        jobFunctions:query?.jobFunctions?.map? query?.jobFunctions : query?.jobFunctions?.split?.(',') ?? null,
        functionTitles: query?.functionTitles?.map? query?.functionTitles : query?.functionTitles?.split?.(',') ?? null
    }

    for (const [key, value] of Object.entries(matchedConfigFromUrl)) {
        defaultValues[key] = [value[0]['seo-value'] || value[0]['seo_value']]
    }
    for (const [key, value] of Object.entries(matchedLocation)) {
        defaultValues[key] = value[0]
        // to prevent cases where /jobs-hiring/makati-jobs, whereby the query & location is populated with values
        if (defaultValues.urlQuery === value[0]['seo_value']) {
            defaultValues.urlQuery = ''
        }
    }
    // sanitise searchQuery
    defaultValues.urlQuery = defaultValues.urlQuery ? unslugify(searchQuery).replace('+', '-') : ''
    const sort = defaultValues?.sort

    let payload = {
        query: defaultValues?.urlQuery,
        location: location
            ? mapSeoValueToGetValue((location).split?.(','), formattedLocationList, false, true)
            : null,
        category: category
            ? mapSeoValueToGetValue((category).split?.(','), catList, true)
            : null,
        salary: salary ? mapSeoValueToGetValue((salary).split?.(','), salaryRangeList) : null,
        jobType: jobType ? mapSeoValueToGetValue((jobType).split?.(','), jobTypeList) : null,
        industry: industry
            ? mapSeoValueToGetValue((industry).split?.(','), industryList)
            : null,
        qualification: qualification
            ? mapSeoValueToGetValue((qualification).split?.(','), eduLevelList)
            : null,
        workExperience: workExperience
            ? mapSeoValueToGetValue((workExperience).split?.(','), expLvlList)
            : null,
        verifiedCompany: Boolean(verifiedCompany),
        mainFunctions: query?.mainFunctions?.split?.(',')?.map?.(seo => mainFunctionList.find(item => item.seo_value === seo)?.value)?.join?.(',') ?? null,
        jobFunctions: query?.jobFunctions?.split?.(',')?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
        functionTitles: query?.functionTitles?.split?.(',')?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
        sort,
        page: page ? Number(page) : 1
    }

    for (const [key, value] of Object.entries(matchedConfigFromUrl)) {
        if (key === 'verifiedCompany') {
            payload = {
                ...payload,
                [key]: value[0].value ? true : false
            }
        } else if (['jobFunctions', 'functionTitles'].includes(key)) {
            payload = {
                ...payload,
                [key]: payload[key] ? (payload[key] += value[0].id) : value[0].id
            }
        } else {
            payload = {
                ...payload,
                [key]: payload[key] ? (payload[key] += value[0].value) : value[0].value
            }
        }
    }
    for (const [key, value] of Object.entries(matchedLocation)) {
        payload = {
            ...payload,
            [key]:
                payload[key] && payload[key] !== value[0].value
                    ? (payload[key] += value[0].value)
                    : value[0].value
        }
    }

    return { defaultValues, payload, config }
}