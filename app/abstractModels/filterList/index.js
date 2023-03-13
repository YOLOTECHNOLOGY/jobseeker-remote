import { Free } from 'fantasy-frees'
import { taggedSum } from 'daggy'
const { liftFC: DO } = Free

export const Actions = taggedSum('FilterListActions', {
    buildQuery: ['params'],
    redirect: ['query'],
    parseUrl: ['url'],
    updateParams: ['url'],
    getSearchValue: ['params'],
    updateSearchHistory: ['searchValue']
})

export const onSearchScript = params => DO(Actions.buildQuery(params))
    .chain(query => DO(Actions.redirect(query)))

export const onLoadScript = url => DO(Actions.parseUrl(url))
    .chain(params => DO(Actions.updateParams(params)))

export const updateSearchHistoryScript = params => DO(Actions.getSearchValue(params))
    .chain(searchValue => DO(Actions.updateSearchHistory(searchValue)))
