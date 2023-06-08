import style from '../../index.module.scss';
import React, {useCallback, useRef, useState} from 'react';
import classNames from "classnames";
import EmblaCarousel from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller} from 'swiper';
import useWindowSize from "../../../../../hooks/useWindowSize";

let countries = [
	{
		"country": "Philippines",
		"flag": require("../assets/Philippines-flag.png").default.src,
		"image": require("../assets/Philippines.png").default.src
	},
	{
		"country": "Singapore",
		"flag": require("../assets/Singapore-flag.png").default.src,
		"image": require("../assets/Singapore.png").default.src
	},
	{
		"country": "Indonesia",
		"flag": require("../assets/Indonesia-flag.png").default.src,
		"image": require("../assets/Indonesia.png").default.src
	},

	{
		"country": "Hongkong",
		"flag": require("../assets/Hongkong-flag.png").default.src,
		"image": require("../assets/Hongkong.png").default.src,
		"coming": true,
	},

	{
		"country": "Malaysia",
		"flag": require("../assets/Malaysia-flag.png").default.src,
		"image": require("../assets/Malaysia.png").default.src,
		"coming": true,
	},

	{
		"country": "Thailand",
		"flag": require("../assets/Thailand-flag.png").default.src,
		"image": require("../assets/Thailand.png").default.src,
		"coming": true,
	},
	{
		"country": "Vietnam",
		"flag": require("../assets/Vietnam-flag.png").default.src,
		"image": require("../assets/Vietnam.png").default.src,
		"coming": true,
	},
];

if (countries.length % 2 !== 0) {
	countries = countries.concat(countries)
}
const Section6 = () => {

	return <section className={style.section6}>
		<img className={style.section6_bg + ' ' + style.desktop} alt={'-'}
		     src={require('../svg/section6-bg.svg').default.src}/>
		<img className={style.section6_bg_mobile + ' ' + style.mobile} alt={'img-bg'}
		     src={require('../assets/mobile-section6-bg.png').default.src}/>
		<div className={style.content_container}>
			<div className={style.section6_title}>
				Best hiring APP in Southeast-Asia
			</div>
			<div className={style.section6_des}>Find jobs anywhere, everywhere</div>
			<Section5Carousel/>
		</div>
	</section>
}


const Section5Carousel = () => {

	const swiperRef = useRef(null)
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const isMobile = width <= 540;
	return <div className={style.embla__container}
	            onMouseLeave={(event) => {
		            swiperRef.current.swiper.autoplay.start();
		            setEnable(false)
	            }}
	            onMouseEnter={(event) => {
		            swiperRef.current.swiper.autoplay.pause();
		            setEnable(true);
	            }}
	>
		<Swiper
			modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
			spaceBetween={12}
			ref={swiperRef}
			slidesPerView={isMobile ? 1.15 : 3.3}
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
										<div>
											Coming
										</div>
										<div>soon...</div>
									</div> : null}
									<div className={style.country_name}>
										{country.country}
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