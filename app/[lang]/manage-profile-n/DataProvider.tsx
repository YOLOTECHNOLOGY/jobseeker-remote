'use client';

import React from 'react';
import { ConfigType } from 'app/types';
import { ManageProfileData } from './service';


interface ProviderData {
  config?: Partial<ConfigType>
  profile?: ManageProfileData
}

const MangeProfile = React.createContext<
	ProviderData | undefined
>(undefined);

interface Props extends React.PropsWithChildren<ProviderData> {
	name?: any
}
export function MangeProfileProvider(
	{children, ...props}: Props) {
  
	return (
		<MangeProfile.Provider value={props}>
			{children}
		</MangeProfile.Provider>
	);
}

export function useManageProfileData() {
	const context = React.useContext(MangeProfile);
	if (context === undefined) {
		throw new Error('useCartCount must be used within a CartCountProvider');
	}
	return context;
}
