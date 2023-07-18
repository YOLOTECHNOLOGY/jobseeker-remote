import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'

export async function fetchUserOwnDetail(accessToken) {

	try {
		const response = await fetchUserOwnDetailService({accessToken});
		if (response.status === 200 || response.status === 201) {
			return response.data
		}
	} catch (error) {
		return error
	}
}


export interface ManageProfileData {
  id:                             number;
  first_name:                     string;
  last_name:                      string;
  full_name:                      string;
  gender:                         null;
  email:                          string;
  mobile_country_id:              number;
  phone_num:                      string;
  phone_num_without_country_code: string;
  avatar:                         string;
  avatar_tmm:                     string;
  location_id:                    number;
  location:                       string;
  country_id:                     number;
  country_key:                    string;
  country:                        string;
  description:                    string;
  xp_lvl_id:                      number;
  xp_lvl:                         string;
  is_fb_messenger_active:         boolean;
  is_email_verify:                boolean;
  is_mobile_verified:             boolean;
  status_key:                     string;
  notice_period_id:               number;
  notice_period:                  string;
  is_profile_completed:           boolean;
  is_profile_update_required:     boolean;
  ats_user_id:                    null;
  job_preferences:                JobPreference[];
  work_experiences:               WorkExperience[];
  educations:                     Education[];
  resume:                         Resume;
  resumes:                        Resume[];
  skills:                         string[];
  referral_code:                  string;
  websites:                       Website[];
  license_certifications:         LicenseCertification[];
  birthdate:                      string;
  working_since:                  string;
  fcm_token:                      null;
  fcm_token_web_jobseeker:        string;
  fcm_token_web_recruiter:        null;
  greeting_message:               GreetingMessage;
  is_visible:                     boolean;
  is_no_disturb:                  boolean;
  no_disturb_start_time:          null;
  no_disturb_end_time:            null;
  is_chat_message:                boolean;
  last_active_at:                 string;
  years_of_experience:            number;
  email_notification_setting:     EmailNotificationSetting;
  active_key:                     number;
  jobseeker_lack_field_num:       null;
}

export interface Education {
  id:                    number;
  school:                string;
  school_id:             null;
  degree_id:             number;
  degree_key:            string;
  degree:                string;
  field_of_study:        null | string;
  grade:                 null;
  study_period_from:     null | string;
  study_period_to:       null | string;
  is_currently_studying: boolean;
  description:           null;
  location_key:          string;
  location:              string;
  country_key:           null;
  country_id:            null;
}

export interface EmailNotificationSetting {
  system_email:     boolean;
  chat_email:       boolean;
  newsletter_email: boolean;
}

export interface GreetingMessage {
  id:      number;
  message: string;
}

export interface JobPreference {
  id:                    number;
  job_title:             string;
  location_id:           number;
  location_key:          string;
  location:              string;
  salary_range_from:     string;
  salary_range_to:       string;
  salary_range:          string;
  currency_id:           number;
  currency_key:          string;
  currency:              string;
  job_type_id:           number;
  job_type_key:          string;
  job_type:              string;
  industry_id:           number;
  industry_key:          string;
  industry:              string;
  country_id:            number;
  country_key:           string;
  country:               string;
  notice_period_id:      number;
  notice_period:         string;
  function_job_title_id: number;
  job_categories:        string[];
  function_job_title:    string;
}

export interface LicenseCertification {
  id:                   number;
  title:                string;
  issuing_organisation: string;
  is_permanent:         boolean;
  issue_date:           string;
  expiry_date:          string;
  credential_id:        string;
  credential_url:       string;
}

export interface Resume {
  id:         number;
  url:        string;
  name:       string;
  updated_at: string;
  user_id:    number;
}

export interface Website {
  id:          number;
  title:       string;
  url:         string;
  description: string;
}

export interface WorkExperience {
  id:                     number;
  company:                string;
  company_id:             null;
  company_industry_id:    number;
  company_industry:       string;
  job_title:              string;
  salary:                 string;
  currency_id:            number;
  working_period_from:    string;
  working_period_to:      string;
  is_currently_work_here: boolean;
  description:            string;
  description_html:       string;
  location:               null;
  country_key:            string;
  country:                string;
  country_id:             number;
  function_job_title_id:  number;
  job_categories:         any[];
  function_job_title:     string;
  skills:                 any[];
}
