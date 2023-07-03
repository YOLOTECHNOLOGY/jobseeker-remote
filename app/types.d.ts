
export interface ConfigType {
  xp_lvls:                         TartuGecko[];
  job_types:                       TartuGecko[];
  degrees:                         TartuGecko[];
  no_of_employee_ranges:           TartuGecko[];
  company_sizes:                   TartuGecko[];
  industry_lists:                  TartuGecko[];
  job_category_lists:              JobCategoryList[];
  job_benefit_lists:               List[];
  job_attractive_reasons:          ChatReportList[];
  company_benefit_lists:           List[];
  company_culture_lists:           List[];
  company_financing_stage_lists:   TartuGecko[];
  country_lists:                   CountryList[];
  location_lists:                  LocationList[];
  chat_report_lists:               ChatReportList[];
  notice_period_lists:             ChatReportList[];
  subscibe_job_frequency_lists:    ChatReportList[];
  report_job_reasons:              ReportJobReason[];
  report_talent_reasons:           ReportReason[];
  salary_ranges:                   SalaryRanges;
  social_types:                    SocialType[];
  resume_source_lists:             ResumeSourceList[];
  language_lists:                  LanguageList[];
  gender_lists:                    ChatReportList[];
  pipeline_stage_lists:            ChatReportList[];
  resume_last_updated_time_lists:  ChatReportList[];
  job_function_lists:              { [key: string]: BFunctionList[] }[];
  main_job_function_lists:         MainJobFunctionList[];
  report_interview_reasons:        ReportReason[];
  report_recruiter_reasons:        ReportReason[];
  report_company_reasons:          ReportReason[];
  currency_lists:                  TartuGecko[];
  turnover_lists:                  ChatReportList[];
  company_types:                   ChatReportList[];
  work_xps:                        TartuGecko[];
  educations:                      TartuGecko[];
  salary_range_filters:            SalaryRangeFilter[];
  users:                           TartuGecko[];
  jobs:                            TartuGecko[];
  company_documents:               TartuGecko[];
  recruiter_documents:             TartuGecko[];
  job_seeker_work_xps:             TartuGecko[];
  job_seeker_prefs:                TartuGecko[];
  job_seeker_edus:                 TartuGecko[];
  saved_jobs:                      TartuGecko[];
  saved_candidates:                TartuGecko[];
  blacklisted_users:               TartuGecko[];
  blacklisted_companies:           TartuGecko[];
  job_seeker_resumes:              TartuGecko[];
  job_applications:                ChatReportList[];
  dialogues:                       ChatReportList[];
  chats:                           TartuGecko[];
  interview_result:                ChatReportList[];
  feature_banners:                 FeatureBanner[];
  recruiter_role_permissions:      TartuGecko[];
  recruiter_chat_type_filters:     TartuGecko[];
  recruiter_chat_status_filters:   TartuGecko[];
  jobseeker_chat_type_filters:     TartuGecko[];
  recruiter_hot_job_title_filters: ChatReportList[];
  main_functions:                  FunctionTitle[];
  job_functions:                   FunctionTitle[];
  function_titles:                 FunctionTitle[];
}

export interface TartuGecko {
  id:              number;
  key?:            string;
  value:           string;
  sort_order?:     number;
  "seo-value"?:    string;
  is_popular?:     boolean;
  display_symbol?: string;
  is_featured?:    boolean;
  permissions?:    Permission[];
}

export interface Permission {
  id:       number;
  value:    string;
  key:      string;
  can_view: boolean;
  can_edit: boolean;
}

export interface ChatReportList {
  id:    number;
  value: string;
}

export interface List {
  id:             number;
  value?:         string;
  category:       string;
  category_value: string;
  name?:          string;
}

export interface CountryList {
  id:                   number;
  key:                  string;
  code:                 string;
  value:                string;
  currency_id:          number | null;
  is_sms_allowed:       boolean;
  is_bossjob_supported: boolean;
  region_lists:         RegionList[];
}

export interface RegionList {
  id:             number;
  key:            string;
  display_name:   string;
  priority_order: number;
  location_lists: TartuGecko[];
}

export interface FeatureBanner {
  id:                   number;
  cover_pic_url:        string;
  tablet_cover_pic_url: string;
  mobile_cover_pic_url: string;
  title:                null;
  cta_url:              string;
  sort_order:           number;
}

export interface FunctionTitle {
  key:                   string;
  seo_value:             string;
  function_title_value?: string;
  value:                 string;
  id:                    number;
  children?:             Child[];
}

export interface Child {
  id:           number;
  value:        string;
  is_featured?: boolean;
  "seo-value":  string;
  job_titles?:  TartuGecko[];
  skills?:      TartuGecko[];
}

export interface JobCategoryList {
  id:          number;
  key:         string;
  value:       string;
  sort_order:  number;
  "seo-value": string;
  sub_list:    TartuGecko[];
}

export interface BFunctionList {
  id:          number;
  value:       string;
  "seo-value": string;
  job_titles:  TartuGecko[];
  skills:      TartuGecko[];
}

export interface LanguageList {
  value: string;
  id:    number;
  code:  string;
}

export interface LocationList {
  id:           number;
  country_id:   number;
  key:          string;
  value:        string;
  display_name: string;
  sort_order:   number;
  seo_value:    string;
  locations:    Location[];
}

export interface Location {
  id:                  number;
  key:                 string;
  value:               string;
  is_popular:          boolean;
  region_display_name: string;
  seo_value:           string;
}

export interface MainJobFunctionList {
  id:                number;
  value:             string;
  sort_order:        number;
  "seo-value":       string;
  sub_function_list: BFunctionList[];
}

export interface ReportReason {
  id:          number;
  title:       string;
  description: string;
}

export interface ReportJobReason {
  id:             number;
  title:          string;
  description:    string;
  category:       Category;
  category_value: CategoryValue;
}

export enum Category {
  Broken = "broken",
  Discrimination = "discrimination",
  Spam = "spam",
}

export enum CategoryValue {
  内容错误 = "内容错误",
  垃圾信息 = "垃圾信息",
  歧视 = "歧视",
}

export interface ResumeSourceList {
  value: string;
}

export interface SalaryRangeFilter {
  id:          number;
  key:         string;
  value:       string;
  to:          number;
  condition:   string;
  "seo-value": string;
  from:        number;
}

export interface SalaryRanges {
  id:                number;
  country_id:        number;
  to:                number;
  interval:          number;
  upper_bound_scale: number;
  is_active:         boolean;
  from:              number;
}

export interface SocialType {
  behance?:     string;
  url:          string;
  google_plus?: string;
  linkedin?:    string;
  twitter?:     string;
  facebook?:    string;
}
