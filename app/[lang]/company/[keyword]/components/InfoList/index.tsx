import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import style from './index.module.scss';
import Section from '../Section/index';
import { CompanyDetailsType, JobData, JobsResponseType } from "../../service";
import Map from 'app/(job)/[lang]/job/[jobId]/components/Main/Map/Map';
// import { languageContext } from 'app/[lang]/components/providers/languageProvider';
import JobCard from '../JobsCard/index'
import { languageContext } from "../../../../../components/providers/languageProvider";
import { useCompanyDetail } from '../../DataProvider';
import Image from 'next/image';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';

interface Props extends React.PropsWithChildren<CompanyDetailsType> {
	jobs: JobData[]
	onMore: (e: React.SyntheticEvent) => void
}

const CompanyInfo = (_props: Props) => {
	const props = { ..._props };
	const {config} = useCompanyDetail();
	if (props.company_business_info) {
		props.company_business_info.full_address = _props.full_address;
		props.company_business_info.name = _props.legal_name;
		// @ts-ignore
		props.turnover = config.turnover_lists.filter((_)=>{return _.id === _props.turnover_id})[0]?.value;
		// props.company_business_info.industry = _props.industry;
	}
	const contextLang = useContext(languageContext);

	const info = [
		{
			id: "Introduction",
			title: 'Introduction',
		}, {
			id: "Address",
			title: 'Address',
		}, {
			id: 'Company Album',
			title: 'Company Album',
		}, {
			id: 'Overview',
			title: 'Overview',
		}, {
			id: 'Listing',
			title: 'Listing',
		}, {
			id: 'Business information',
			title: 'Business information',
		}, {
			id: 'Job openings',
			title: 'Job openings',
		}
	];
	const overview_fields = [{
		field: 'industry',
		name: 'Industry',
	}, {
		field: 'financing_stage',
		name: 'Financing',
	}, {
		field: 'created_date',
		name: 'Creation time'
	}, {
		field: 'website',
		name: 'Company website'
	}, {
		field: 'turnover',
		name: 'Turnover',
	}, {
		field: 'phone_num',
		name: 'Telephone'
	}];
	const business_info = [{
		field: 'name',
		name: 'Company name',
	}, {
		name: 'Unified Social Credit Code',
		field: 'social_credit_code',
	}, {
		name: 'Legal representative',
		field: 'legal_representative'
	}, {
		name: 'Registered capital',
		field: 'registered_capital',
	}, {
		name: 'Paid-up capital',
		field: 'paid_in_capital',
	}, {
		name: 'Date of establishment',
		field: 'establishment_date',
	}, {
		name: 'Organization Code',
		field: 'organization_code'
	}, {
		name: 'Business registration number',
		field: 'business_registration_number',
	}, {
		name: 'Taxpayer Identification Number',
		field: 'taxpayer_identification_number'
	}, {
		name: 'Type of enterprise',
		field: 'type_of_enterprise'
	}, {
		name: 'Approval date',
		field: 'approval_date'
	}, {
		name: 'Registered address',
		field: 'full_address'
	}]

	const listing_info = [{
		name: 'Stock code',
		field: 'stock_code',
	}, {
		name: 'IPO valuation(USD)',
		field: 'ipo_valuation',
	}, {
		name: 'Money Raised at IPO(USD)',
		field: 'initial_public_offering',
	}, {
		name: 'IPO issue price(USD)',
		field: 'ipo_issue_price',
	}, {
		name: 'Issue date',
		field: 'issue_date',
	}, {
		name: 'Number of financing',
		field: 'number_of_financing',
	}, {
		name: 'Total financing',
		field: 'total_financing'
	}]
	const { jobs } = useCompanyDetail();

	return <div className={style.tab_content_wrapper}>
		{info.map((item, index) => {
			const noSplit = index === 0;
			if (item.id === 'Introduction' && props.description) {
				return Introduction(index, item, noSplit, props)
			}
			if (item.id === 'Address' && props.full_address) {
				return <Section key={index} title={item.title} split={!noSplit}>
					<Map lat={Number(props.latitude)} lng={Number(props.longitude)} full_address={props.full_address} lang={contextLang.jobDetail} />
				</Section>
			}
			if (item.id === 'Company Album' && props.pictures?.length > 0) {
				return <Section key={index} title={item.title} split={!noSplit}>
					<div className={style.album_wrapper}>
						{props.pictures
							.sort((a, b) => a.sort_order - b.sort_order)
							.padArrayToMultiple(3)
							.map((item, index) => {
								if (!item) return <div className={style.album_item} style={{ width: 226, height: 150 }}></div>
								return <Image key={index} src={item.url} alt="alt" className={style.album_item}
									width={226} height={150} style={{ objectFit: "cover" }} />
							})}
					</div>
				</Section>
			}
			if (item.id === 'Overview') {
				return BusinessInfo(index, item, noSplit, overview_fields, props);
			}
			if (item.id === 'Listing' && props.listing_info) {
				return <Section key={index} title={item.title + ' '} split={!noSplit}>
					<div className={style.overview_item_wrapper}>
						{listing_info
							.filter(item => props.listing_info[item.field])
							.padArrayToMultiple(3)
							.map((item, index) => {
								if (!item) {
									return <div className={style.overview_item} style={{ background: '#ffffff' }} />
								}
								return <div key={index} className={style.overview_item}>
									<div className={style.overview_item_name}>{item.name}</div>
									{item && <MouseOverPopover value={props.listing_info[item?.field]}></MouseOverPopover>}
									{/* <div className={style.overview_item_value}>{props.listing_info[item.field]}</div> */}
								</div>
							})}
					</div>
				</Section>
			}
			if (item.id === 'Business information' && props.company_business_info) {
				return BusinessInfo(index, item, noSplit, business_info, props.company_business_info)
			}
			if (item.id === 'Job openings' && props.jobs?.length) {
				return <Section key={index} title={item.title}>
					{props.jobs.map((item, index) => {
						return <JobCard {...item} key={index}></JobCard>
					}).slice(0, 5)}
					{jobs.total_num > 5 && <div className={style.more} onClick={props.onMore}>
						{`More ${jobs.total_num} Jobs`}
					</div>}

				</Section>

			}
		})}
	</div>
}

export default CompanyInfo




declare global {
	interface Array<T> {
		padArrayToMultiple(num: number): T[];
	}
}

Array.prototype.padArrayToMultiple = function <T>(num: number) {
	const length = this.length;
	const remainder = length % num;
	if (remainder === 0) {
		return this; // Array length is already a multiple of num
	}
	const paddingLength = num - remainder;
	const padding = new Array(paddingLength).fill(null);
	return this.concat(padding) as T[];
};



function Introduction(index: number, item: { id: string; title: string; }, noSplit: boolean, props: { jobs: JobData[]; onMore: (e: React.SyntheticEvent) => void; id: number; coordinator_id: number; legal_name: string; name: string; num_of_members: number; cover_pic_url: string; logo_url: string; logo_tmm: any; company_size: string; industry: string; full_address: string; longitude: number; latitude: number; unit_num: any; website: string; facebook_url: string; instagram_url: string; linkedin_url: string; youtube_url: string; description: string; description_html: string; twitter_url: string; turnover_id: number; cultures: { id: number; value: string; category: string; }[]; benefits: { id: number; value: string; category: string; }[]; pictures: { id: number; url: string; sort_order: number; }[]; company_business_info: any; company_url: string; is_verify: boolean; document: any; financing_stage: string; working_addresses: any[]; industry_id: number; company_size_id: number; financing_stage_id: any; listing_info: any; country_id: number; children?: React.ReactNode; }): JSX.Element {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const [contentHeight, setContentHeight] = useState(150);
	const calculateContentHeight = () => {
		setContentHeight(ref.current.scrollHeight);
	};
	useLayoutEffect(() => {
		calculateContentHeight();
	});
	const handleClick = () => {
		setIsVisible(!isVisible)
	}
	return <Section key={index} title={item.title} split={!noSplit}>
		<div 
			className={classNames({
				[style.introduce_wrapper]: true,
				[style.ellipsis]: !isVisible
			})}
			style={{height: isVisible ? contentHeight :  90}}
		>
			<div 
				className={style.introduction}
				ref={ref}
				dangerouslySetInnerHTML={{
				__html: filterScriptContent(props.description)
			}}>
			</div>
		</div>

		{!isVisible && <div className={style.more} onClick={handleClick}>More</div>}
	</Section>;
}

function BusinessInfo(
	index: number,
	item: { id: string; title: string; },
	noSplit: boolean,
	business_info: { field: string; name: string; }[],
	props: CompanyDetailsType
): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);
	const [contentHeight, setContentHeight] = useState(150);
	const handleClick = () => {
		setIsVisible(!isVisible)
	}
	const contentRef = useRef(null);
	const calculateContentHeight = () => {
		setContentHeight(contentRef.current.scrollHeight);
	};
	useLayoutEffect(() => {
		calculateContentHeight();
	});
	const _resArr = business_info.filter(_ => props[_.field]);
	const showMore = _resArr.length > 6 && !isVisible;
	return <Section key={index} title={item.title + ' '} split={!noSplit}>
		<div className={style.animation_wrapper} style={{ height: showMore ? 150 : contentHeight }}>
			<div className={style.overview_item_wrapper} ref={contentRef}>
				{_resArr
					.map((item) => {
						return <div key={item?.field} className={style.business_item}>
							<div className={style.overview_item_name}>{item?.name}</div>
							{item && <MouseOverPopover value={props[item?.field]}></MouseOverPopover>}
							{/* {item && <div className={style.overview_item_value}>{props[item?.field]}</div>} */}
						</div>;
					})}
			</div>
		</div>
		{showMore && <div className={style.more} onClick={handleClick}>More</div>}
	</Section>;
}

export function filterScriptContent(str: string): string {
	const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	return str.replace(regex, '');
}



export function MouseOverPopover(props: {
	value: string
}) {
	const showPop = props.value.length > 11 

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		if(!showPop) return;
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <div
				className={style.overview_item_value}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
				<span>{props.value}</span>
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }} maxWidth={300} style={{wordBreak: 'break-all'}}>{props.value}</Typography>
      </Popover>
    </>
  );
}