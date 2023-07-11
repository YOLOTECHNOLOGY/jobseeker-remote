import style from '../../index.module.scss';
import React, {useCallback, useRef, useState, useEffect, createContext, useContext} from 'react';
import classNames from "classnames";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller} from 'swiper';
import {useInView, InView } from "react-intersection-observer";
import useWindowSize from "../../../../../hooks/useWindowSize";
import {languageContext} from "../../../../components/providers/languageProvider";

let countries = [
	{
		"country": "Philippines",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Philippines-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Philippines.png`
	},
	{
		"country": "Singapore",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Singapore-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Singapore.png`
	},
	{
		"country": "Indonesia",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Indonesia-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Indonesia.png`
	},

	{
		"country": "Hongkong",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Hongkong-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Hongkong.png`,
	},
	{
		"country": "Japan",
		"flag": `${process.env.S3_BUCKET_URL}/landing/japen-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/japen.png`
	},
	{
		"country": "Macao",
		"flag": `${process.env.S3_BUCKET_URL}/landing/macao-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Macao.png`
	},
	{
		"country": "Taiwan",
		"flag": `${process.env.S3_BUCKET_URL}/landing/taiwan-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/taiwan.png`
	},
	{
		"country": "Malaysia",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Malaysia-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Malaysia.png`,
		"coming": true,
	},

	{
		"country": "Thailand",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Thailand-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Thailand.png`,
		"coming": true,
	},
	{
		"country": "Vietnam",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Vietnam-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Vietnam.png`,
		"coming": true,
	},
	
];

if (countries.length % 2 !== 0) {
	countries = countries.concat(countries)
}
const Section6 = () => {
	const contextLang = useContext(languageContext);
	return <section className={style.section6}>
		<img className={style.section6_bg + ' ' + style.desktop} alt={'-'}
		     src={`${process.env.S3_BUCKET_URL}/landing/Web3-min.jpg`}/>
		<img className={style.section6_bg_mobile + ' ' + style.mobile} alt={'img-bg'}
		     src={`${process.env.S3_BUCKET_URL}/landing/Mobile3-min.jpg`}/>
		<div className={style.content_container}>
			<InView threshold={0.8} triggerOnce={true}>
				{({ref, inView})=>{
					return 	<div className={classNames({
						[style.section6_title]: true,
						[style.animate__bounceIn]: inView
					}) } ref={ref}>
						{contextLang.landing.section6_title || 'Best hiring APP in Southeast-Asia'}
					</div>
				}}
			</InView>
			<InView threshold={0.8} triggerOnce={true}>
				{({ref, inView})=>{
					return <div className={classNames({
						[style.section6_des]: true,
						[style.animate__bounceIn]: inView
					})} ref={ref}>
						{contextLang.landing.section6_subtitle || 'Find jobs anywhere, everywhere'}
					</div>
				}}
			</InView>

			<Section5Carousel/>
		</div>
	</section>
}


const Section5Carousel = () => {
	const contextLang = useContext(languageContext);
	const swiperRef = useRef(null)
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const {ref, inView} = useInView({threshold: 0});
	const isMobile = width <= 540;
	const [modules, setModules] = useState([]);
	useEffect(() => {
		if(inView && !isMobile){
			swiperRef.current.swiper?.autoplay?.start();
		}else{
			swiperRef.current.swiper?.autoplay?.pause();
		}

	},[
		inView,
		modules,
		isMobile
	]);
	return <div className={style.embla__container}
	            onMouseLeave={() => {
								try {
									swiperRef.current.swiper?.autoplay?.start();
									setEnable(false)
								}catch (e){
								}
	            }}
	            onMouseEnter={() => {
								try {
									swiperRef.current.swiper?.autoplay?.pause();
									setEnable(true);
								}catch (e){
								}
	            }}
	            ref={ref}
	>
		<Swiper
			modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
			spaceBetween={12}
			ref={swiperRef}
			slidesPerView={isMobile ? 1.15 : 4}
			grabCursor={true}
			autoplay={{
				delay: 2000,
				disableOnInteraction: true
			}}
			navigation={isMobile ? false : enable}
			loop={true}
			scrollbar={{draggable: true}}
		>
			{
				countries.map((country, index) => {
						return <SwiperSlide key={index}>
							<div className={
								classNames({
									['embla__slide']: true,
									[style.embla__slide_translate]: isMobile ? false : index % 2 === 1,
								})
							} key={index}>
								<div className={style.section6_img_wrapper}>
									<img src={country.image} alt={country.country}
									     className={'embla__slide_bg'}
									/>
									{country.coming ? <div className={style.country_mask}>
										<div className={style.mask_text}>{contextLang.landing.section6_coming_soon}</div>
									</div> : null}
									<img className={style.country_name_mask}
									     alt={'mask'}
									     src={`${process.env.S3_BUCKET_URL}/landing/city_header_mask.svg`}/>
									<div className={style.country_name}>
										{contextLang.landing[country.country] || country.country}
									</div>
								</div>
								<div className={'flag_wrapper'}>
									<img src={country.flag} alt="flag" className={'embla__slide_flag'}/>
								</div>
							</div>
						</SwiperSlide>
					}
				)
			}
		</Swiper>
		<div className={style.section6_carousel_control + ' ' + style.mobile}>
			<div className={style.section6_carousel_control_left} onClick={() => {
				swiperRef.current.swiper.slidePrev();
			}}></div>
			<div className={style.section6_carousel_control_right}
			     onClick={() => {
				     swiperRef.current.swiper.slideNext();
			     }}
			></div>
		</div>
	</div>
}
export default Section6