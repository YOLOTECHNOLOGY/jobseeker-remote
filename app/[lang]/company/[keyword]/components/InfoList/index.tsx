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

interface Props extends React.PropsWithChildren<CompanyDetailsType> {
	jobs: JobData[]
	onMore: (e: React.SyntheticEvent) => void
}

const CompanyInfo = (_props: Props) => {
	const props = { ..._props };
	if (props.company_business_info) {
		props.company_business_info.full_address = _props.full_address;
		props.company_business_info.name = _props.name;
		props.company_business_info.industry = _props.industry;
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
		field: '',
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
		name: 'Paid-in capital',
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
	}, {
		name: 'Industry',
		field: 'industry'
	}]

	const listing_info = [{
		name: 'Stock code',
		field: 'stock_code',
	}, {
		name: 'IPO valuation',
		field: 'ipo_valuation',
	}, {
		name: 'Initial public offering',
		field: 'initial_public_offering',
	}, {
		name: 'IPO issue price',
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
				return <Section key={index} title={item.title} split={!noSplit}>
					<div className={style.introduction} dangerouslySetInnerHTML={{
						__html: filterScriptContent(props.description)
					}}>
					</div>
				</Section>
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