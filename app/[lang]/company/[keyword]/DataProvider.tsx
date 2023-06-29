'use client';

import React, { useState } from 'react';
import {CompanyDetailsType, JobsResponseType, Recruiter} from "./service";


type ProviderData =  {
	detail: CompanyDetailsType,
	jobsRes: JobsResponseType,
	lang: string,
	hr: Recruiter[],
	hotJobs: JobsResponseType
}

const CompanyDetails = React.createContext<
	ProviderData | undefined
>(undefined);

export function CompanyDetailsProvider(
	{ children, initialDetail,initalJobs,lang, hr,hotJobs}: {
	children: React.ReactNode;
	initialDetail: CompanyDetailsType;
	initalJobs: JobsResponseType,
	lang: string,
	hr: Recruiter[],
	hotJobs: JobsResponseType
}) {
	return (
		<CompanyDetails.Provider value={{detail: initialDetail, jobsRes: initalJobs, lang, hr, hotJobs}}>
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
