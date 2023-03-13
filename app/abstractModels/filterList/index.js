import { Free } from 'fantasy-frees'
import { taggedSum } from 'daggy'
const { liftFC: DO } = Free

export const Actions = taggedSum('FilterListActions', {
    buildQuery: ['params'],
    redirect: ['query'],
    updateParams: ['url'],
})
export const UpdateActions = taggedSum('FilterLisUpdateActions', {
    parseUrl: ['url'],
})
export const UpdateSearchHistoryActions = taggedSum('FilterLisUpdateSearchHistoryActions', {
    updateSearchHistory: ['url'],
    getSearchValue: ['params'],

})

export const onSearchScript = params => DO(Actions.buildQuery(params))
    .chain(query => DO(Actions.redirect(query)))

export const onLoadScript = url => DO(UpdateActions.parseUrl(url))

export const updateSearchHistoryScript = params => DO(UpdateSearchHistoryActions.getSearchValue(params))
    .chain(searchValue => DO(UpdateSearchHistoryActions.updateSearchHistory(searchValue)))
