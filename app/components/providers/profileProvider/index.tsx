'use client';

import React, {useCallback, useState} from 'react';
import { ConfigType } from 'app/types';
import { ManageProfileData, fetchUserOwnDetail } from './service';
import { useManageProfileData } from 'app/[lang]/manage-profile/DataProvider';
import { getCookie } from 'helpers/cookies';


interface ProviderData {
  profile?: ManageProfileData
	fetchProfile?: ()=>void
}

const MangeProfile = React.createContext<
	ProviderData | undefined
>(undefined);

interface Props extends React.PropsWithChildren<ProviderData> {
	name?: any
}
export function ProfileProvider(
	{children, ...props}: Props) {
  const [profile, setProfile]  = useState(props.profile);
	const accessToken = getCookie('accessToken')

	const fetchProfile = useCallback(()=>{
		fetchUserOwnDetail(accessToken).then(profile=>{
			setProfile(profile.data)
		})
	},[]);
	return (
		<MangeProfile.Provider value={{...props,profile,fetchProfile}}>
			{children}
		</MangeProfile.Provider>
	);
}

export function useProfileData() {
	const context = React.useContext(MangeProfile);
	if (context === undefined) {
		throw new Error('useManageProfileData must be used within a MangeProfileProvider');
	}
	return context;
}
