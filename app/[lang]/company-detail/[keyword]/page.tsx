'use client';
import * as React from 'react';
import style from './index.module.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CompanyInfo from './components/InfoList';
import Section from "./components/Section";
import CulturePanel from "./components/Culture";
import ChatPanel from "./components/ChatPanel";


function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const {children, value, index, ...other} = props;

	return (
		<div
			// role="tabpanel"
			// hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

const Page = () => {
	const [value, setValue] = React.useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const tab_title = ['Company information', 'Jobs'];
	return <div className={style.container}>
		<div className={style.header}>

		</div>
		<div className={style.content}>
			<div className={style.tab_wrapper}>
				<div className={style.tab_layout}>
					<Tabs value={value} onChange={handleChange}>
						<Tab label={tab_title[0]} {...a11yProps(0)} />
						<Tab label={tab_title[1]} {...a11yProps(1)} />
					</Tabs>
				</div>

			</div>


			<TabPanel value={value} index={0}>
				<div className={style.company_info_tab_wrapper}>
					<Section title={'Hot Jobs'}>
						<div className={style.jobs_item_layout}>
							<div className={style.jobs_item}></div>
							<div className={style.jobs_item}></div>
							<div className={style.jobs_item}></div>
						</div>
					</Section>
					<div className={style.company_info_wrapper}>
						<CompanyInfo/>
						<div className={style.company_culture}>
							<CulturePanel/>
							<div style={{height: 40}}></div>
							<ChatPanel/>
						</div>
					</div>
				</div>

			</TabPanel>
		</div>
		<div className={style.footer}></div>
	</div>
}


export default Page;