import { cond, T } from "ramda"


export const buildQuery = (location, searchValue) => {
    const onlyLoaction = () => !searchValue && !!location
    const locationAndSearch = () => searchValue && location
    const onlySearch = () => searchValue && !location
    const buildLocationAndOneValue = (location, value) => {
        return `/jobs-hiring/${encodeURIComponent(value?.value || value)}-jobs-in-${encodeURIComponent(location)}`
    }
    const buildOnlyOneValue = value => {
        return `/jobs-hiring/${encodeURIComponent(value?.value || value)}-jobs`
    }
    return cond([
        [onlySearch, () => buildOnlyOneValue(searchValue)],
        [onlyLoaction, () => buildOnlyOneValue(location)],
        [locationAndSearch, buildLocationAndOneValue],
        [T, () => '/jobs-hiring/job-search']
    ])(location, searchValue).toLowerCase()

}