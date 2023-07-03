import { handleSalary } from "helpers/jobPayloadFormatter";
import { fetchJobsListService } from "store/services/jobs/fetchJobsList";
import { fetchConfigService } from "store/services/config/fetchConfig";
import { fetchCompanyDetailService } from "store/services/companies2/fetchCompanyDetail";
import { fetchCompanyHRService } from "store/services/companies2/fetchCompanyHR"
import { fetchHotJobsListService } from "store/services/jobs/fetchHotJobs";


export async function fetchJobsListReq(data, accessToken) {

	try {
		const {
			query,
			location,
			salary,
			workExperience,
			qualification,
			jobType,
			// industry,
			verifiedCompany,
			page,
			mainFunctions,
			sort,
			jobFunctions,
			functionTitles,
			category,
			size,
			companyIds,
		} = data;

		const [salaryFrom, salaryTo] = handleSalary(salary?.split(','))
		const payload = {
			query,
			job_location_ids: location,
			job_categories: category,
			salary_from: salaryFrom,
			salary_to: salaryTo,
			// company_industries: industry,
			degrees: qualification,
			xp_lvls: workExperience,
			job_types: jobType,
			company_ids: companyIds,
			is_company_verified: verifiedCompany,
			main_functions: mainFunctions,
			function_job_title_ids: functionTitles,
			job_functions_ids: jobFunctions,
			sort,
			page,
			size: size || 30,
			source: 'web',
		}

		const response = await fetchJobsListService(payload, accessToken);
		if (response.status === 200 || response.status === 201) {
			return response.data
		}
	} catch (error) {
		return error
	}
}


export async function fetchConfigReq(payload) {
	try {
		return await fetchConfigService(payload)
	} catch (error) {
		return error
	}
}


export async function fetchCompanyDetailReq(payload) {
	try {
		const response = await fetchCompanyDetailService(payload);

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		}
	} catch (err) {
		return err
	}
}
export async function fetchCompanyHR(id, token) {
	try {
		const response = await fetchCompanyHRService(id, token);

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		}
	} catch (e) {
		return e
	}
}



export interface CompanyDetailsType {
	id: number;
	coordinator_id: number;
	legal_name: string;
	name: string;
	num_of_members: number;
	cover_pic_url: string;
	logo_url: string;
	logo_tmm: null | any;
	company_size: string;
	industry: string;
	full_address: string;
	longitude: number;
	latitude: number;
	unit_num: null | any;
	website: string;
	facebook_url: string;
	instagram_url: string;
	linkedin_url: string;
	youtube_url: string;
	description: string;
	description_html: string;
	twitter_url: string;
	turnover_id: number;
	cultures: {
		id: number;
		value: string;
		category: string;
	}[];
	benefits: {
		id: number;
		value: string;
		category: string;
	}[];
	pictures: {
		id: number;
		url: string;
		sort_order: number;
	}[];
	company_business_info: {
		approval_date: string;
		business_registration_number: number;
		company_id: number;
		created_at: string;
		establishment_date: string
		id: number
		legal_representative: string
		organization_code: string
		paid_in_capital: string
		registered_capital: string
		social_credit_code: string
		taxpayer_identification_number: number
		type_of_enterprise: string
		address: string
		industry: string
	} | any;
	company_url: string;
	is_verify: boolean;
	document: null | any;
	financing_stage: string;
	working_addresses: any[];
	industry_id: number;
	company_size_id: number;
	financing_stage_id: null | any;
	listing_info: {
		company_id: number
		id: number
		initial_public_offering: string
		ipo_issue_price: string
		ipo_valuation: string
		issue_date: string
		number_of_financing: string
		stock_code: string
		total_financing: string
	} | any;
	country_id: number;
}

export interface JobsResponseType {
	page: number;
	size: number;
	sort: number;
	total_num: number;
	total_pages: number;
	jobs: JobData[];
	explain: Params;

}

export interface JobData {
	id: number;
	degree_id: number;
	degree: string;
	job_location_id: number;
	job_location: string;
	job_type_id: number;
	job_type: string;
	xp_lvl_id: number;
	xp_lvl: string;
	job_title: string;
	salary_range_from: number;
	salary_range_to: number;
	job_url: string;
	status_key: string;
	country_id: number;
	job_country_key: string;
	job_country: string;
	job_skills: string;
	job_benefits: { id: number; name: string }[];
	is_featured: boolean;
	highlighted: boolean;
	external_apply_url: string | null;
	is_salary_hidden: boolean;
	refreshed_at: string;
	expired_at: string;
	updated_at: string;
	function_job_title_id: number;
	function_job_title: string;
	main_job_function_id: number;
	main_function: string;
	job_function_id: number;
	sub_function: string;
	job_region_id: number;
	job_region: string;
	company_id: number;
	company_name: string;
	company_logo: string;
	company_url: string;
	company_address: string;
	company_location_id: number;
	company_location: string;
	company_country_id: number;
	company_country: string;
	company_industry_id: number;
	company_industry: string;
	company_size_id: number;
	company_size: string;
	company_financing_stage_id: string | null;
	company_financing_stage: string;
	is_company_verify: boolean;
	recruiter_id: number;
	recruiter_full_name: string;
	recruiter_job_title: string;
	recruiter_avatar: string;
	recruiter_last_active_at: string;
	recruiter_is_online: boolean;
	salary_range_value: string;
	local_salary_range_value: string;
	is_saved: boolean;
	is_urgent: boolean;
}


interface Params {
	explain: boolean;
	query: string;
	query_fields: string[];
	sort: number;
	page: number;
	size: number;
	source: string;
	country_id: number;
	is_collapse: boolean;
	input: Input[];
	main_functions: any[];
	main_job_function_ids: any[];
	job_function_ids: any[];
	function_job_title_ids: any[];
	job_location_ids: any[];
}

interface Input {
	boolean_query: string;
	query_type: string;
	key: string;
	value: any;
}

interface Query {
	bool: {
		filter: any[];
	};
}

interface SortObject {
	_script: {
		type: string;
		order: string;
		script: {
			source: string;
		};
	};
}

interface Analysis {
	synonyms: any[];
	query_string: string;
}




export interface Recruiter {
	id: number;
	avatar: string;
	full_name: string;
	job_title: string;
}

interface Location {
	id: number;
	key: string;
	value: string;
	is_popular: boolean;
	region_display_name: string;
	seo_value: string;
}

export interface Country {
	id: number;
	country_id: number;
	key: string;
	value: string;
	display_name: string;
	sort_order: number;
	seo_value: string;
	locations: Location[];
}

export interface JobClasses {
	id: number;
	job_titles: any[];
	["seo-value"]: string;
	skills: any[];
	value: string;
}
export const getIDFromKeyword = (keyword: string) => {
	return keyword.split('-').pop();
}

const ConfigKeys = ['xp_lvls', 'job_types', 'degrees', 'no_of_employee_ranges', 'company_sizes', 'industry_lists', 'job_category_lists', 'job_benefit_lists', 'job_attractive_reasons', 'company_benefit_lists', 'company_culture_lists', 'company_financing_stage_lists', 'country_lists', 'location_lists', 'chat_report_lists', 'notice_period_lists', 'subscibe_job_frequency_lists', 'report_job_reasons', 'report_talent_reasons', 'salary_ranges', 'social_types', 'resume_source_lists', 'language_lists', 'gender_lists', 'pipeline_stage_lists', 'resume_last_updated_time_lists', 'job_function_lists', 'main_job_function_lists', 'report_interview_reasons', 'report_recruiter_reasons', 'report_company_reasons', 'currency_lists', 'turnover_lists', 'company_types', 'work_xps', 'educations', 'salary_range_filters', 'users', 'jobs', 'company_documents', 'recruiter_documents', 'job_seeker_work_xps', 'job_seeker_prefs', 'job_seeker_edus', 'saved_jobs', 'saved_candidates', 'blacklisted_users', 'blacklisted_companies', 'job_seeker_resumes', 'job_applications', 'dialogues', 'chats', 'interview_result', 'feature_banners', 'recruiter_role_permissions', 'recruiter_chat_type_filters', 'recruiter_chat_status_filters', 'jobseeker_chat_type_filters', 'recruiter_hot_job_title_filters', 'main_functions', 'job_functions', 'function_titles']
export type ConfigTypeKeys = typeof ConfigKeys[number];

export interface ConfigType {
	location_lists: Country[];
	[key: ConfigTypeKeys]: any[];
}