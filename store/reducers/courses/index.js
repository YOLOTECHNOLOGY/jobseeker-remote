import { combineReducers } from 'redux'

import fetchRecommendedCoursesReducer from './fetchRecommendedCourses'

const coursesReducers = combineReducers({
  recommendedCourses: fetchRecommendedCoursesReducer,
})

export default coursesReducers
