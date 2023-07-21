import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import style from './index.module.scss';
import styles from '../SearchPanel/index.module.scss'
import Section from '../Section/index';
import { CompanyDetailsType, JobData, JobsResponseType } from "../../service";
import Map from 'app/(job)/[lang]/job/[jobId]/components/Main/Map/Map';
// import { languageContext } from 'app/[lang]/components/providers/languageProvider';
import JobCard from '../JobsCard/index'
import { languageContext } from "../../../../../components/providers/languageProvider";
import { useCompanyDetail } from '../../DataProvider';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';
import useWindowSize from 'hooks/useWindowSize';
import { useMediaQuery } from '@mui/material';
import { SocialMedia, TagContent } from '../Culture';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { ChatItem } from '../ChatPanel'
import { detail } from 'app/[lang]/chat/[chat_id]/interpreters/services/offer';
import "swiper/swiper.min.css";
import { formatTemplateString } from 'helpers/formatter';
import Lightbox from 'react-image-lightbox';
import { MouseOverPopover } from 'app/components/popover/MouseOverPopover';


interface Props extends React.PropsWithChildren<CompanyDetailsType> {
	jobs: JobData[]
	onMore: (e: React.SyntheticEvent) => void
}

const CompanyInfo = (_props: Props) => {
	const props = { ..._props };
	const { config, detail } = useCompanyDetail();
	const { width } = useWindowSize();
	const [isOpenLightbox, setLightbox] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);
	const isMobile = width < 767;
	if (!props.company_business_info) {
		props.company_business_info = {}
	}
	if (props.company_business_info) {
		props.company_business_info.full_address = _props.full_address;
		props.company_business_info.name = _props.legal_name;
		// @ts-ignore
		props.turnover = config.turnover_lists.filter((_) => { return _.id === _props.turnover_id })[0]?.value;
		console.log('config.company_types',config.company_types,props.company_business_info);
		props.company_business_info.company_type = config.company_types.find(_=> _.id === props.company_business_info.type_of_enterprise_id)?.value
		// props.company_business_info.industry = _props.industry;
	}
	// @ts-ignore
	props.turnover = (config?.turnover_lists || []).filter((_) => { return _.id === _props.turnover_id })?.[0]?.value;

	const contextLang = useContext(languageContext);
	const { overview, tab } = contextLang.companyDetail;
	const info = [
		{
			id: "Introduction",
			title: overview.Introduction,
		}, {
			id: "Address",
			title: contextLang.myJobs.address,
		}, {
			id: 'Company Album',
			title: overview.CompanyAlbum,
		}, {
			id: 'Overview',
			title: tab.overview,
		}, {
			id: 'Listing',
			title: overview.Listing,
		}, {
			id: 'Business information',
			title: overview.BusinessInformation,
		}, {
			id: 'Job openings',
			title: overview.JobOpenings,
		}
	];
	const overview_fields = [{
		field: 'industry',
		name: overview.industry,
	}, {
		field: 'financing_stage',
		name: overview.Financing,
	}, {
		field: 'created_date',
		name: overview.CreationTime
	}, {
		field: 'website',
		name: overview.CompanyWebsite
	}, {
		field: 'turnover',
		name: overview.Turnover,
	}, {
		field: 'phone_num',
		name: overview.Telephone
	}];
	const business_info = [{
		field: 'name',
		name: overview.CompanyName,
	}, {
		field: 'social_credit_code',
		name: overview.UnifiedSocialCreditCode,
	}, {
		field: 'legal_representative',
		name: overview.LegalRepresentative,

	}, {
		name: overview.RegisteredCapital,
		field: 'registered_capital',
	}, {
		name: overview.PaidUpCapital,
		field: 'paid_in_capital',
	}, {
		name: overview.DateOfEstablishment,
		field: 'establishment_date',
	}, {
		name: overview.OrganizationCode,
		field: 'organization_code'
	}, {
		name: overview.BusinessRegistrationNumber,
		field: 'business_registration_number',
	}, {
		name: overview.TaxpayerIdentificationNumber,
		field: 'taxpayer_identification_number'
	}, {
		name: overview.TypeOfEnterprise,
		field: 'type_of_enterprise'
	}, {
		name: overview.ApprovalDate,
		field: 'approval_date'
	}, {
		name: overview.RegisteredAddress,
		field: 'full_address'
	}, {
		name: overview.CompanyType,
		field : 'company_type'
	}]

	const listing_info = [
		{
			name: overview.StockCode,
			field: 'stock_code',
		},
		{
			name: overview.IpoValuationUsd,
			field: 'ipo_valuation',
		},
		{
			name: overview.MoneyRaisedAtIpoUsd,
			field: 'initial_public_offering',
		},
		{
			name: overview.IpoIssuePriceUsd,
			field: 'ipo_issue_price',
		},
		{
			name: overview.IssueDate,
			field: 'issue_date',
		},
		{
			name: overview.NumberOfFinancing,
			field: 'number_of_financing',
		},
		{
			name: overview.TotalFinancing,
			field: 'total_financing',
		},
	];

	const { jobs, hr } = useCompanyDetail();

	if (isMobile) {
		return <div className={style.tab_content_wrapper}>
			{
				props.full_address && <Section title={info[1].title}>
					<Map lat={Number(props.latitude)} lng={Number(props.longitude)} full_address={props.full_address} lang={contextLang.jobDetail} />
				</Section>}
			{Introduction(0, info[0], true, props)}
			{props.cultures && props.cultures.length > 0 &&
				<Section title={overview.CompanyFeatures}>
					<TagContent type={'culture'} {...props}></TagContent>
				</Section>}
			{props.benefits && props.benefits.length > 0 &&
				<Section title={overview.CompanyBenefits}>
					<TagContent type={'benefits'} {...props}></TagContent>
				</Section>}
			{BusinessInfo(2, info[3], true, overview_fields, props)}
			{hr?.length > 0 &&
				<Section title={overview.HiBoss}>
					{MobileHiBoss()}
				</Section>}
			{props.pictures?.length > 0 && <Section title={info[2].title}>
				{MobileAlbum()}
			</Section>}
			{listing_info
				.filter(item => props.listing_info?.[item.field]).length > 0 && <Section title={info[4]['title']}>
					<div className={style.overview_item_wrapper}>
						{
							padArrayToMultiple(listing_info
								.filter(item => props.listing_info[item.field]))(2)
								.map((item, index) => {
									if (!item || !props.listing_info[item?.field]) {
										return <div className={style.overview_item} key={index} style={{ background: '#ffffff' }} />
									}
									return <div key={index} className={style.overview_item}>
										<div className={style.overview_item_name}>{item.name}</div>
										{item && <MouseOverPopover value={props.listing_info[item?.field]}></MouseOverPopover>}
										{/* <div className={style.overview_item_value}>{props.listing_info[item.field]}</div> */}
									</div>
								})}
					</div>
				</Section>}
			{BusinessInfo(4, info[5], true, business_info, props.company_business_info)}
			{<SocialMedia {...detail}></SocialMedia>}
		</div>
	}
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
				return <>
					<Section key={index} title={item.title} split={!noSplit}>
						<div className={style.album_wrapper}>
							
							{
								padArrayToMultiple(props.pictures
									.sort((a, b) => a.sort_order - b.sort_order))(3)
									.map((item, index) => {
										if (!item) return <div className={style.album_item} style={{ width: 226, height: 150 }}></div>
										return <Image key={index} src={item.url} alt="alt" className={style.album_item}
											onClick={() => {
												setPhotoIndex(index)
												setLightbox(true)
											}}
											width={238} height={134} style={{ objectFit: "cover" }} />
									})}
						</div>
					</Section>
					{isOpenLightbox && (
          <Lightbox
            mainSrc={props.pictures[photoIndex].url}
            nextSrc={props.pictures[(photoIndex + 1) % props.pictures.length].url}
            prevSrc={props.pictures[(photoIndex + props.pictures.length - 1) % props.pictures.length].url}
            onCloseRequest={() => setLightbox(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex)=> (photoIndex + props.pictures.length - 1) % props.pictures.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex)=> (photoIndex + 1) % props.pictures.length)
            }
          />
        )}
				</>
			}
			if (item.id === 'Overview') {
				return BusinessInfo(index, item, noSplit, overview_fields, props);
			}
			if (item.id === 'Listing' &&
				props.listing_info &&
				listing_info
					.filter(item => props.listing_info?.[item.field]).length > 0) {
				return <Section key={index} title={item.title + ' '} split={!noSplit}>
					<div className={style.overview_item_wrapper}>
						{
							padArrayToMultiple(listing_info
								.filter(item => props.listing_info[item.field]))(3)
								.map((item, index) => {
									if (!item || !props.listing_info[item?.field]) {
										return <div className={style.overview_item} key={index} style={{ background: '#ffffff' }} />
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
						{formatTemplateString(overview.AllJobs, { total_num: jobs.total_num })}
						{/* {`More ${jobs.total_num} Jobs`} */}
					</div>}

				</Section>

			}
		})}
	</div>
}

export default CompanyInfo


export const padArrayToMultiple = arr => function <T>(num: number) {
	const length = arr.length;
	const remainder = length % num;
	if (remainder === 0) {
		return arr; // Array length is already a multiple of num
	}
	const paddingLength = num - remainder;
	const padding = new Array(paddingLength).fill(null);
	return arr.concat(padding) as T[];
};



function Introduction(index: number, item: { id: string; title: string; }, noSplit: boolean, props: { jobs: JobData[]; onMore: (e: React.SyntheticEvent) => void; id: number; coordinator_id: number; legal_name: string; name: string; num_of_members: number; cover_pic_url: string; logo_url: string; logo_tmm: any; company_size: string; industry: string; full_address: string; longitude: number; latitude: number; unit_num: any; website: string; facebook_url: string; instagram_url: string; linkedin_url: string; youtube_url: string; description: string; description_html: string; twitter_url: string; turnover_id: number; cultures: { id: number; value: string; category: string; }[]; benefits: { id: number; value: string; category: string; }[]; pictures: { id: number; url: string; sort_order: number; }[]; company_business_info: any; company_url: string; is_verify: boolean; document: any; financing_stage: string; working_addresses: any[]; industry_id: number; company_size_id: number; financing_stage_id: any; listing_info: any; country_id: number; children?: React.ReactNode; }): JSX.Element {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const [contentHeight, setContentHeight] = useState(150);
	const calculateContentHeight = () => {
		setContentHeight(ref.current?.scrollHeight);
	};
	const [showMore, setShow] = useState(false);
	useLayoutEffect(() => {
		calculateContentHeight();
		if (isContentOverflowing(ref.current)) {
			setShow(true);
		}
	});
	const handleClick = () => {
		setIsVisible(!isVisible)
	}
	const isMobile = useMediaQuery('(max-width: 768px)');

	const contextLang = useContext(languageContext);
	const { overview, tab } = contextLang.companyDetail;
	if (!props.description) return null;
	return <Section key={index} title={item.title} split={!noSplit}>
		<div
			className={classNames({
				[style.introduce_wrapper]: true,
				[style.ellipsis]: !isVisible
			})}
			style={{ height: isVisible ? contentHeight : isMobile ? '0.94rem' : 90 }}
		>
			<div
				className={style.introduction}
				ref={ref as React.RefObject<HTMLDivElement>}
				dangerouslySetInnerHTML={{
					__html: filterScriptContent(props.description)
				}}>
			</div>
		</div>

		{showMore && <div className={style.more} onClick={handleClick}>{isVisible ? overview.Less : overview.More}</div>}
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
		setContentHeight(contentRef.current?.scrollHeight);
	};
	useLayoutEffect(() => {
		calculateContentHeight();
	});
	const isMobile = useMediaQuery('(max-width: 768px)');

	const contextLang = useContext(languageContext);
	const { overview, tab } = contextLang.companyDetail;
	if (!props) return null;

	const _resArr = business_info.filter(_ => props[_?.field]);
	const showMore = _resArr.length > 4;
	return <Section key={index} title={item.title + ' '} split={!noSplit}>
		<div className={style.animation_wrapper} style={{
			height: !isVisible ? !showMore ? "auto" : 130 : contentHeight

		}}>
			<div className={style.overview_item_wrapper} ref={contentRef}>
				{_resArr
					.map((item) => {
						const value = props[item?.field];
						const is_url = isURL(value);
						return <div key={item?.field} className={style.business_item}>
							<div className={style.overview_item_name}>{item?.name}</div>
							{item && !isMobile && <MouseOverPopover value={props[item?.field]}></MouseOverPopover>}
							{(() => {
								if (item && isMobile && is_url) return <Link href={value} className={style.overview_item_value_mobile} target={"_blank"} title={value}>{value}</Link>;
								if (item && isMobile) return <div className={style.overview_item_value_mobile}>{props[item?.field]}</div>
							})()}
						</div>;
					})}
			</div>
		</div>
		{showMore && <div className={style.more} onClick={handleClick}>{isVisible ? overview.Less : overview.More}</div>}
	</Section>;
}

export function filterScriptContent(str: string): string {
	const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	return str.replace(regex, '');
}


export function isURL(str) {
	// Regular expression pattern to match a URL
	const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

	// Test the string against the pattern
	return urlPattern.test(str);
}

function isContentOverflowing(element) {
	return element?.scrollWidth > element?.clientWidth || element?.scrollHeight > element?.clientHeight;
}

export function MobileHiBoss() {
	const { hr } = useCompanyDetail();
	return <div className={styles.filter_container}>
		{
			hr.map((item, index) => {
				return <div key={index}>
					<ChatItem {...item}></ChatItem>
				</div>
			})
		}
	</div>
	// return <div>
	// 	<Swiper
	// 		spaceBetween={10}
	// 		slidesPerView={2.3}
	// 		// loop={true}
	// 		scrollbar={{ draggable: true }}
	// 	>
	// 		{
	// 			hr.map((item, index) => {
	// 				return <SwiperSlide key={index}>
	// 					<ChatItem {...item}></ChatItem>
	// 				</SwiperSlide>
	// 			})
	// 		}
	// 	</Swiper>
	// </div>
}

function MobileAlbum() {
	const { detail } = useCompanyDetail();
	const [isOpenLightbox, setLightbox] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);
	const res = detail.pictures;
	if (!res?.length) return null;
	return <div>
		<Swiper
			spaceBetween={30}
			slidesPerView={1.2}
			// loop={true}
			scrollbar={{ draggable: true }}
		>
			{
				res.map((item, index) => {
					return <SwiperSlide key={index}>
						<div className={style.mobile_album}>
							<Image style={{ objectFit: 'cover' }} fill src={item.url} alt='album'
									onClick={()=>{
										setPhotoIndex(index);
										setLightbox(true);
										
									}}
							></Image>
						</div>
					</SwiperSlide>
				})
			}
		</Swiper>
		{
		isOpenLightbox && (
			<Lightbox
				mainSrc={res[photoIndex].url}
				nextSrc={res[(photoIndex + 1) % res.length].url}
				prevSrc={res[(photoIndex + res.length - 1) % res.length].url}
				onCloseRequest={() => setLightbox(false)}
				onMovePrevRequest={() =>
					setPhotoIndex((photoIndex)=> (photoIndex + res.length - 1) % res.length)
				}
				onMoveNextRequest={() =>
					setPhotoIndex((photoIndex)=> (photoIndex + 1) % res.length)
				}
			/>
		)
		}

	</div>
}