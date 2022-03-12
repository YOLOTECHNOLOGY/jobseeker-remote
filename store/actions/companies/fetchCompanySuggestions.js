import {
  FETCH_COMPANY_SUGGESTIONS_REQUEST,
  FETCH_COMPANY_SUGGESTIONS_SUCCESS,
  FETCH_COMPANY_SUGGESTIONS_FAILED,
} from 'store/types/companies/fetchCompanySuggestions'

const fetchCompanySuggestionsRequest = (payload) => ({
  type: FETCH_COMPANY_SUGGESTIONS_REQUEST,
  payload,
})

const fetchCompanySuggestionsSuccess = (payload) => ({
  type: FETCH_COMPANY_SUGGESTIONS_SUCCESS,
  payload,
})

const fetchCompanySuggestionsFailed = (error) => ({
  type: FETCH_COMPANY_SUGGESTIONS_FAILED,
  error,
})

export { fetchCompanySuggestionsRequest, fetchCompanySuggestionsSuccess, fetchCompanySuggestionsFailed }
