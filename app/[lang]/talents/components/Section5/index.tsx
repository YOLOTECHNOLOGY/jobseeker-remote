import style from '../../index.module.scss';
import React, {useRef, useState, CSSProperties, useContext} from 'react';
import AnimatedNumbers from "react-animated-numbers";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Player, Controls} from '@lottiefiles/react-lottie-player';
import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";
import useWindowSize from "../../../../../hooks/useWindowSize";
import json1 from './lottie_1';
import json2 from './lottie_2';
import json4 from './lottie_4';
import {languageContext} from "../../../components/providers/languageProvider";

let carouselList = [
	{
		img: `${process.env.S3_BUCKET_URL}/landing/phone1.png`,
		mobile_img: `${process.env.S3_BUCKET_URL}/landing/section5-mobile-1.png`,
		des: 'Build your resume easily, choose from a variety of templates ',
		// json: json1,
		mobile_style: {
			position: 'absolute',
			top: '-80px',
			width: '100%'
		} as CSSProperties,
		style: {width: '100%', position: 'absolute', left: 0, top: '-132px'} as CSSProperties
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/phone2.png`,
		mobile_img: `${process.env.S3_BUCKET_URL}/landing/section5-mobile-2.png`,
		des: 'Protect your privacy and easily block companies',
		// json: json2,
		mobile_style: {
			display: 'none',
		} as CSSProperties,
		style: {width: '312px', position: 'absolute', left: 14, top: '-18px'} as CSSProperties
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section5-3.png`,
		mobile_img: `${process.env.S3_BUCKET_URL}/landing/section5-mobile-3.png`,
		des: 'Customise your chat messages and make a great impression.',
		mobile_style: {
			display: 'none',
		} as CSSProperties
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/phone4.png`,
		mobile_style: {
			display: 'none',
		} as CSSProperties ,
		mobile_img: `${process.env.S3_BUCKET_URL}/landing/section5-mobile-4.png`,
		des: 'Never miss an interview again. Sync your interview schedule directly to your phone',
		// json: json4,
		style: {width: '284px', position: 'absolute', left: '27px', top: '-80px'} as CSSProperties
	}
];
// if (carouselList.length % 2 !== 0) {
carouselList = carouselList.concat(carouselList)
// }
const Section5 = () => {
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const isMobile = width < 540;
	const swiperRef = useRef(null);
	const swiperRef1 = useRef(null);
	const swiperRef2 = useRef(null);

	const section5DesElements = document.querySelectorAll("[data-class='section5-des']");
	let maxHeight = 0;

	section5DesElements.forEach(element => {
		const elementHeight = (element as HTMLElement).offsetHeight;
		if (elementHeight > maxHeight) {
			maxHeight = elementHeight;
		}
	});
	const contextLang =  useContext(languageContext);

	if(contextLang.landing.section5_list_des1){
		carouselList[0].des = contextLang.landing.section5_list_des1;
		carouselList[1].des = contextLang.landing.section5_list_des2;
		carouselList[2].des = contextLang.landing.section5_list_des3;
		carouselList[3].des = contextLang.landing.section5_list_des4;
	}

	if (isMobile) {
		return <section className={style.section5}>
				<Swiper
					modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
					spaceBetween={50}
					ref={swiperRef1}
					grabCursor={true}
					loop={true}
					slidesPerView={1}
					// centeredSlides={true}
					// autoplay={{
					// 	delay: 2000,
					// 	disableOnInteraction: true
					// }}
					// navigation={{
					// 	enabled: true,
					// 	prevEl: '.swiper-button-prev',
					// 	nextEl: '.swiper-button-next',
					// 	hideOnClick: true,
					// 	hiddenClass: 'hideClass'
					// }}
					scrollbar={{draggable: true}}
				>
					{carouselList.map((item, index) => {
						return <SwiperSlide key={index}>
							<div className={style.section5_carousel_item}>
								<div className={style.mobile_section5_des} data-class="section5-des">
									{item.des}
								</div>
								<img src={isMobile ? item.mobile_img : item.img} alt="img" className={style.section5_carousel_pic}/>
								{/* {item?.json && <Player autoplay loop src={item?.json} style={item.mobile_style}></Player>} */}
							</div>
							{/* <div className={style.section5_des}> */}
							{/* 	{item.des} */}
							{/* </div> */}
						</SwiperSlide>
					})}
				</Swiper>
			<div className={style.mobile_section5_control}>
				<div className={style.section5_carousel_control_left}
				     onClick={() => {
					     swiperRef1.current.swiper.slidePrev();
				     }}/>
				<div className={style.section5_carousel_control_right}
				     onClick={()=>{
							 swiperRef1.current.swiper.slideNext();
				     }}
				/>
			</div>

			<AnimationNumber/>
			<img className={style.mobile_section5_bg}
			     src={`${process.env.S3_BUCKET_URL}/landing/Mobile2-min.jpg`}
			     alt="_"/>
		</section>
	}
	return <section className={style.section5}>
		{!isMobile && <img className={style.section5_bg + ' ' + style.desktop} alt={'-'}
	                   src={`${process.env.S3_BUCKET_URL}/landing/Web2-min.jpg`}/>}
		{/* <div className={style.content_container}> */}
		<div className={style.section5_carousel + ' ' + style.desktop}
		     onMouseLeave={(event) => {
			     swiperRef.current.swiper.autoplay.start();
			     setEnable(true)
		     }}
		     onMouseEnter={(event) => {
			     swiperRef.current.swiper.autoplay.pause();
			     setEnable(false);
		     }}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y, Controller]}
				spaceBetween={50}
				ref={swiperRef}
				grabCursor={true}
				slidesPerView={3.5}
				// centeredSlides={true}
				autoplay={{
					delay: 10 * 1000,
					disableOnInteraction: true
				}}
				// navigation={{
				// 	enabled: true,
				// 	prevEl: '.swiper-button-prev',
				// 	nextEl: '.swiper-button-next',
				// 	hideOnClick: true,
				// 	hiddenClass: 'hideClass'
				// }}
				loop={true}
				scrollbar={{draggable: true}}
			>
				{carouselList.map((item, index) => {
					return <SwiperSlide key={index}>
						<div className={style.section5_carousel_item}>
							<img src={item.img} alt="img" className={style.section5_carousel_pic}/>
					{/* 		{ */}
					{/* 			item.json && */}
				  {/* <Player */}
					{/*   autoplay */}
					{/*   loop */}
					{/*   src={item.json} */}
					{/*   style={item.style} */}
				  {/* > */}

				  {/* </Player> */}
					{/* 		} */}
						</div>
						<div className={style.section5_des}>
							{item.des}
						</div>
					</SwiperSlide>
				})}
			</Swiper>
		</div>

		{/* </div> */}
		<AnimationNumber/>
	</section>
}


const AnimationNumber = () =>{
	const fontSize = {fontSize: 56}

	const contextLang = useContext(languageContext);

	return (
		<div className={style.section5_bottom_wrapper}>
			<div className={style.section5_bottom_border_wrapper}>
				<div className={style.section5_bottom}>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								includeComma
								animateToNumber={76.9}
								fontStyle={{fontSize: 56}}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
								]}
							></AnimatedNumbers>
							<span>%</span>
						</div>
						<div className={style.section5_bottom_des}>
							<span>{ contextLang.landing?.section5_bottom_des1 || 'Employers responding within 72hr'} </span>
						</div>
					</div>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								animateToNumber={1}
								fontStyle={fontSize}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
								]}
							></AnimatedNumbers>
							<span>in</span>
							<AnimatedNumbers
								animateToNumber={5}
								fontStyle={fontSize}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
								]}
							></AnimatedNumbers>
						</div>
						<div className={style.section5_bottom_des}>
							<span>{contextLang.landing?.section5_bottom_des2 || 'Get 1 interview invite every 5 chats'}</span>
						</div>
					</div>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								animateToNumber={10}
								fontStyle={fontSize}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 100},
								]}
							></AnimatedNumbers>
							<span>K+</span>
						</div>
						<div className={style.section5_bottom_des}>
							<span>{contextLang.landing.section5_bottom_des3 || 'Companies hiring actively on Bossjob'}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Section5