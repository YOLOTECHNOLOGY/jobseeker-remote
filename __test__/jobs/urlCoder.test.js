
import { describe, test, expect } from '@jest/globals';
import { encode } from '../../app/job-search/interpreters/encoder'

describe('job search url-coder test', () => {

   test('only query', () => {
      const result = encode({ query: 'Java Developer' })
      expect(result.searchQuery).toBe('java-developer-jobs')
   })

   test('query and location', () => {
      const result = encode({ query: 'Java Developer', location: 'Manila' })
      expect(result.searchQuery).toBe('java-developer-jobs-in-manila')
   })

   test('only one function title', () => {
      const result = encode({ query: '', functionTitles: ['Python Developer'] })
      expect(result.searchQuery).toBe('python-developer-jobs')
      expect(result.functionTitles).toBe(null || undefined)
   })

   test('only function titles', () => {
      const result = encode({ query: '', functionTitles: ['Python Developer','Java Developer'] })
      expect(result.searchQuery).toBe('job-search')
      expect(result.params.functionTitles).toStrictEqual(["python-developer", "java-developer"])
   })

   test('only one salary', () => {
      const result = encode({ query: '',  salary:['Below 30K'] })
      expect(result.searchQuery).toBe('below-30k-jobs')
   })

   test('only one job type', () => {
      const result = encode({ query: '',  jobType:['Full time'] })
      expect(result.searchQuery).toBe('full-time-jobs')
   })
})