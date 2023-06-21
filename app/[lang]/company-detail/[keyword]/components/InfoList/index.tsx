import React from 'react';
import style from './index.module.scss';
import Section from '../Section/index';

const CompanyInfo = () =>{
	const info = [
		{
			id: "Introduction",
			title: 'Introduction',
		},{
			id: "Address",
			title: 'Address',
		},{
			id: 'Company Album',
			title: 'Company Album',
		},{
			id: 'Overview',
			title: 'Overview',
		},{
			id: 'Listing',
			title: 'Listing',
		},{
			id: 'Business information',
			title: 'Business information',
		},{
			id: 'Job openings',
			title: 'Job openings',
		}
	]
	return <div className={style.tab_content_wrapper}>
		{info.map((item,index)=>{
			const noSplit = index === 0;
			return <Section key={index} title={item.title} split={!noSplit}>

			</Section>
		})}
	</div>
}

export default CompanyInfo


