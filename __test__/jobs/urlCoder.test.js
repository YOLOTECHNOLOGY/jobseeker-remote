
import { describe, test, expect } from '@jest/globals';
import { encode, decoder } from '../../app/jobs-hiring/interpreters/encoder'
import config from './mockConfig'

describe('job search url-encoder test', () => {

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
      const result = encode({ query: '', functionTitles: ['Python Developer', 'Java Developer'] })
      expect(result.searchQuery).toBe('job-search')
      expect(result.params.functionTitles).toStrictEqual(["python-developer", "java-developer"])
   })

   test('only one salary', () => {
      const result = encode({ query: '', salary: ['Below 30K'] })
      expect(result.searchQuery).toBe('below-30k-jobs')
   })

   test('only one job type', () => {
      const result = encode({ query: '', jobType: ['Full time'] })
      expect(result.searchQuery).toBe('full-time-jobs')
   })
})
describe('job search url-decoder test', () => {

   test('only query', () => {
      const result = decoder(config)('java-developer-jobs', {})
      expect(result.query).toBe('java developer')
   })
   test('only query and location', () => {
      const result = decoder(config)('java-developer-jobs-in-manila', {})
      expect(result.query).toBe('java developer')
      expect(result.location).toStrictEqual(['manila'])
   })
   test('only main function', () => {
      const result = decoder(config)('sales-jobs', {})
      expect(result.mainFunctions).toStrictEqual(['sales'])
      expect(result.query).toBe('' || undefined)
   })
   test('main functions in params', () => {
      const result = decoder(config)('job-search', { mainFunctions: ['design', 'sales'] })
      expect(result.mainFunctions).toStrictEqual(['design', 'sales'])
      expect(result.query).toBe('' || undefined)
   })
   test('only salary', () => {
      const result = decoder(config)('below-30k-jobs', {})
      expect(result.salary).toStrictEqual(['below-30k'])
      expect(result.query).toBe('' || undefined)
   })
   test('only salary and location', () => {
      const result = decoder(config)('below-30k-jobs-in-manila', {})
      expect(result.salary).toStrictEqual(['below-30k'])
      expect(result.location).toStrictEqual(['manila'])
      expect(result.query).toBe('' || undefined)
   })
   test('only job type', () => {
      const result = decoder(config)('full-time-jobs', {})
      expect(result.jobType).toStrictEqual(['full-time'])
      expect(result.query).toBe('' || undefined)
   })
   test('only job type and location', () => {
      const result = decoder(config)('full-time-jobs-in-manila', {})
      expect(result.jobType).toStrictEqual(['full-time'])
      expect(result.location).toStrictEqual(['manila'])
      expect(result.query).toBe('' || undefined)
   })
})
