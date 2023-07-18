'use client';

import React, {useCallback, useState} from 'react';
import { ConfigType } from 'app/types';
import { ManageProfileData, fetchUserOwnDetail } from './service';
import { set } from 'date-fns';


interface ProviderData {
  config?: Partial<ConfigType>
  profile?: ManageProfileData
	token?: string
	fetchProfile?: ()=>void
}

const MangeProfile = React.createContext<
	ProviderData | undefined
>(undefined);

interface Props extends React.PropsWithChildren<ProviderData> {
	name?: any
}
export function MangeProfileProvider(
	{children, ...props}: Props) {
  const [profile, setProfile]  = useState(props.profile);
	const fetchProfile = useCallback(()=>{
		fetchUserOwnDetail(props?.token).then(profile=>{
			setProfile(profile.data)
		})
	},[]);
	return (
		<MangeProfile.Provider value={{...props,profile,fetchProfile}}>
			{children}
		</MangeProfile.Provider>
	);
}

export function useManageProfileData() {
	const context = React.useContext(MangeProfile);
	if (context === undefined) {
		throw new Error('useManageProfileData must be used within a MangeProfileProvider');
	}
	return context;
}
