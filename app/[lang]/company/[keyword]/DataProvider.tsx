'use client';

import React from 'react';
import { CompanyDetailsType, JobsResponseType, Recruiter } from "./service";
import { ConfigType } from 'app/types';
import { Country, JobClasses } from './service';


type ProviderData = {
	detail: CompanyDetailsType,
	jobs: JobsResponseType,
	lang: string,
	hr: Recruiter[],
	hotJobs: JobsResponseType
	config: Partial<ConfigType>
	jobFunctions: JobClasses[]
}

const CompanyDetails = React.createContext<
	ProviderData | undefined
>(undefined);

interface Props extends React.PropsWithChildren<ProviderData> {
	name?: any
}
export function CompanyDetailsProvider(
	{ children, detail, jobs, lang, hr, hotJobs, config, jobFunctions }: Props) {
	return (
		<CompanyDetails.Provider value={{ detail, jobs, lang, hr, hotJobs, config, jobFunctions}}>
			{children}
		</CompanyDetails.Provider>
	);
}

export function useCompanyDetail() {
	const context = React.useContext(CompanyDetails);
	if (context === undefined) {
		throw new Error('useCartCount must be used within a CartCountProvider');
	}
	return context;
}
