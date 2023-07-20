import { JobFunction } from 'app/components/commons/jobFunction';
export interface JobFunctionListsItem {
  id:          number;
  value:       string;
  "seo-value": string;
  job_titles:  JobTitle[];
  skills:      JobTitle[];
}

export interface JobTitle {
  id:           number;
  value:        string;
  is_featured?: boolean;
  "seo-value":  string;
}

const FunctionJobFunctionListKeys = ['Customer Service/Operations', 'Information Technology', 'Human Resources/Admin/Legal', 'Sales', 'Finance/Audit/Tax', 'Agriculture/Environment', 'Arts/Media/Communications', 'Banking', 'Building/Construction', 'Design', 'Education/Training', 'Food and Beverages', 'Healthcare/Medical', 'Hotel/Tourism', 'Logistics/Supply Chain', 'Managerial', 'Manufacturing', 'Marketing/PR/Advertising', 'Others', 'Product Management', 'Professional Services', 'Purchasing/Trading', 'Services/Retail', 'Telecommunication', 'WEB3']
export type FunctionJobFunctionListKeys = typeof FunctionJobFunctionListKeys[number];


export type JobFunctionListsType  = {[FunctionJobFunctionListKeys]: JobFunctionListsItem[]}[]