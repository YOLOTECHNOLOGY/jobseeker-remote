import {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILED
} from 'store/types/config/fetchConfig'

export const initialState = {
  fetching: false,
  response: {
    inputs: {
      xp_lvls: [],
      job_types: [],
      degrees: [],
      no_of_employee_ranges: [],
      company_sizes: [],
      industry_lists: [],
      job_category_lists: [],
      job_benefit_lists: [],
      job_attractive_reasons: [],
      company_benefit_lists: [],
      company_culture_lists: [],
      company_financing_stage_lists: [],
      country_lists: [],
      location_lists: [],
      chat_report_lists: [],
      notice_period_lists: [],
      subscibe_job_frequency_lists: [],
      report_job_reasons: [
        {
          id: 1,
          title: "I think it's a scam, phishing or malware",
          description:
            'Ex: someone asks for personal information or money or posts suspicious links',
          category: 'spam'
        },
        {
          id: 2,
          title: "I think it's promotional or spam",
          description:
            'Ex: someone advertises a product for monetary gain or posts irrelevant content for high visibility',
          category: 'spam'
        },
        {
          id: 3,
          title: "I think it's discriminatory, or advocates, or supports discrimination",
          description: 'Ex: discriminates based off of age or sex',
          category: 'discrimination'
        },
        {
          id: 4,
          title: "I think it's offensive or harassing",
          description: 'Ex: threats of violence or unwelcome advances',
          category: 'discrimination'
        },
        {
          id: 5,
          title: 'I think it shows or promotes extreme violence or terrorism',
          description: 'Ex: torture, rape or abuse, terrorist acts, or recruitment for terrorism',
          category: 'discrimination'
        },
        {
          id: 6,
          title: 'The job is closed',
          description: 'Ex: it’s no longer accepting applicants',
          category: 'broken'
        },
        {
          id: 7,
          title: 'The job has an incorrect company',
          description: 'Ex: the job has the wrong company name or page display',
          category: 'broken'
        },
        {
          id: 8,
          title: 'This job has an incorrect location',
          description: 'Ex: the city, state, province or country is incorrect',
          category: 'broken'
        },
        {
          id: 9,
          title: 'The job has incorrect formatting',
          description:
            'Ex: its job details has missing text, gramatical errors, or other formatting mistakes',
          category: 'broken'
        },
        {
          id: 10,
          title: 'This job does not belong on Bossjob',
          description: 'Ex: the job from this page should not be posted on Bossjob',
          category: 'broken'
        }
      ],
      report_talent_reasons: [],
      salary_ranges: {},
      social_types: [],
      resume_source_lists: [],
      language_lists: [],
      gender_lists: [],
      pipeline_stage_lists: [],
      resume_last_updated_time_lists: [],
      job_function_lists: [],
      report_interview_reasons: [],
      report_recruiter_reasons: [],
      main_functions: [],
      job_functions: [],
      function_titles: []
    },
    filters: {
      work_xps: [],
      educations: [],
      salary_range_filters: [],
      company_sizes: []
    },
    status: {
      users: [],
      jobs: [],
      company_documents: [],
      recruiter_documents: [],
      job_seeker_work_xps: [],
      job_seeker_prefs: [],
      job_seeker_edus: [],
      saved_jobs: [],
      saved_candidates: [],
      blacklisted_users: [],
      blacklisted_companies: [],
      job_seeker_resumes: [],
      job_applications: [],
      dialogues: [],
      chats: []
    },
    feature_banners: [],
    recruiter_role_permissions: []
  },
  error: null
}

export default function fetchConfig(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONFIG_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null
      }
    case FETCH_CONFIG_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error?.toString?.(),
        response: {}
      }
    default:
      return { ...state }
  }
}
