import style from '../../index.module.scss';
import React, {useRef, useState} from 'react';
import AnimatedNumbers from "react-animated-numbers";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';

import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";
import useWindowSize from "../../../../../hooks/useWindowSize";

let carouselList = [
	{
		img: require('../assets/section5-1.png').default.src,
		des: 'Build your resume easily, choose from a variety of templates '
	},
	{
		img: require('../assets/section5-2.png').default.src,
		des: 'Protect your privacy and easily block companies'
	},
	{
		img: require('../assets/section5-3.png').default.src,
		des: 'Customise your chat messages and make a great impression.'
	},
	{
		img: require('../assets/section5-4.png').default.src,
		des: 'Never miss an interview again. Sync your interview schedule directly to your phone'
	}
];
// if (carouselList.length % 2 !== 0) {
	carouselList = carouselList.concat(carouselList)
// }
const Section5 = () =>{
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const swiperRef = useRef(null);
	const isMobile = width < 540;
	return <section className={style.section5}>
		{!isMobile && <img className={style.section5_bg + ' ' + style.desktop} alt={'-'} src={require('../svg/section5-bg.svg').default.src}/>}
		{isMobile && <img className={style.mobile_section5_bg} src={require('../assets/section5-mobile-bg.png').default.src} alt="_"/>}
		{/* <div className={style.content_container}> */}
		<div className={style.section5_carousel + ' ' + style.desktop}
		     onMouseLeave={(event) => {
			     console.log('onMouseLeave');
			     swiperRef.current.swiper.autoplay.start();
			     setEnable(true)
		     }}
		     onMouseEnter={(event) => {
			     console.log('onMouseEnter');
			     swiperRef.current.swiper.autoplay.pause();
			     setEnable(false);
		     }}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
				spaceBetween={50}
				ref={swiperRef}
				grabCursor={true}
				slidesPerView={3.5}
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
				// loop={true}
				scrollbar={{draggable: true}}
			>
				{carouselList.map((item,index)=>{
						return <SwiperSlide key={index}>
								<div className={style.section5_carousel_item}>
									<img src={item.img} alt="img" className={style.section5_carousel_pic}/>
								</div>
								<div className={style.section5_des}>
									{item.des}
								</div>
						</SwiperSlide>
					})}
			</Swiper>
		</div>

		{/* </div> */}
		<div className={style.section5_bottom_wrapper}>
			<div className={style.section5_bottom_border_wrapper}>
				<div className={style.section5_bottom}>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								includeComma
								animateToNumber={76.9}
								fontStyle={{ fontSize: 64 }}
								locale="en-US"
								configs={[
									{ mass: 1, tension: 220, friction: 50 },
								]}
							></AnimatedNumbers>
							<span>%</span>
						</div>
						<div className={style.section5_bottom_des}>
							<span>Employers responding within 72hr</span>
						</div>
					</div>
					<div className={style.section5_bottom_item}>
							<div className={style.section5_bottom_title}>
								<AnimatedNumbers
									animateToNumber={1}
									fontStyle={{ fontSize: 64 }}
									locale="en-US"
									configs={[
										{ mass: 1, tension: 220, friction: 50 },
									]}
								></AnimatedNumbers>
								<span>in</span>
								<AnimatedNumbers
									animateToNumber={5}
									fontStyle={{ fontSize: 64 }}
									locale="en-US"
									configs={[
										{ mass: 1, tension: 220, friction: 50 },
									]}
								></AnimatedNumbers>
							</div>
						<div className={style.section5_bottom_des}>
							<span>Get 1 interview invite every 5 chats</span>
						</div>
					</div>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								animateToNumber={10}
								fontStyle={{ fontSize: 64 }}
								locale="en-US"
								configs={[
									{ mass: 1, tension: 220, friction: 100 },
								]}
							></AnimatedNumbers>
							<span>K+</span>
						</div>
						<div className={style.section5_bottom_des}>
							<span>Companies hiring actively on Bossjob</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
}

export default Section5