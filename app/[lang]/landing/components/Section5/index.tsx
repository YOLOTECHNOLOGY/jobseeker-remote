import style from '../../index.module.scss';
import React, {useRef, useState, CSSProperties} from 'react';
import AnimatedNumbers from "react-animated-numbers";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Player, Controls} from '@lottiefiles/react-lottie-player';
import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";
import useWindowSize from "../../../../../hooks/useWindowSize";
import json1 from './lottie_1';
import json2 from './lottie_2';
import json4 from './lottie_4';

let carouselList = [
	{
		img: require('./phone1.png').default.src,
		des: 'Build your resume easily, choose from a variety of templates ',
		json: json1,
		style: {width: '312px', position: 'absolute', left: 0, top: '-62px'} as CSSProperties
	},
	{
		img: require('./phone2.png').default.src,
		des: 'Protect your privacy and easily block companies',
		json: json2,
		style: {width: 268, position: 'absolute', left: 16, top: 0} as CSSProperties

	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section5-3.png`,
		des: 'Customise your chat messages and make a great impression.'
	},
	{
		img: require('./phone4.png').default.src,
		des: 'Never miss an interview again. Sync your interview schedule directly to your phone',
		json: json4,
		style: {width: '270px', position: 'absolute', left: '20px', top: '12px'} as CSSProperties
	}
];
// if (carouselList.length % 2 !== 0) {
carouselList = carouselList.concat(carouselList)
// }
const Section5 = () => {
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const swiperRef = useRef(null);
	const swiperRef1 = useRef(null);
	const swiperRef2 = useRef(null);

	const isMobile = width < 540;

	if (isMobile) {
		return <section className={style.section5}>


				<Swiper
					modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
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
					// loop={true}
					scrollbar={{draggable: true}}
				>
					{carouselList.map((item, index) => {
						return <SwiperSlide key={index}>
							<div className={style.section5_carousel_item}>
								<div className={style.mobile_section5_des}>
									{item.des}
								</div>
								<img src={item.img} alt="img" className={style.section5_carousel_pic}/>

								{item.json && <Player autoplay loop src={item.json} style={item.style}></Player>}
							</div>
							<div className={style.section5_des}>
								{item.des}
							</div>
						</SwiperSlide>
					})}
				</Swiper>
			<div className={style.mobile_section5_control}>
				<div className={style.section5_carousel_control_left}
				     onClick={() => {
					     swiperRef1.current.swiper.slidePrev();
					     swiperRef2.current.swiper.slidePrev();
				     }}/>
				<div className={style.section5_carousel_control_right}
				     onClick={()=>{
							 swiperRef2.current.swiper.slideNext();
							 swiperRef1.current.swiper.slideNext();
				     }}
				/>
			</div>

			<AnimationNumber/>
			<img className={style.mobile_section5_bg} src={`${process.env.S3_BUCKET_URL}/landing/section5-bg.svg`}
			     alt="_"/>
		</section>
	}
	return <section className={style.section5}>
		{!isMobile && <img className={style.section5_bg + ' ' + style.desktop} alt={'-'}
	                   src={`${process.env.S3_BUCKET_URL}/landing/section5-bg.svg`}/>}
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
				{carouselList.map((item, index) => {
					return <SwiperSlide key={index}>
						<div className={style.section5_carousel_item}>
							<img src={item.img} alt="img" className={style.section5_carousel_pic}/>
							{
								item.json &&
				  <Player
					  autoplay
					  loop
					  src={item.json}
					  style={item.style}
				  >

				  </Player>
							}
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
	return (
		<div className={style.section5_bottom_wrapper}>
			<div className={style.section5_bottom_border_wrapper}>
				<div className={style.section5_bottom}>
					<div className={style.section5_bottom_item}>
						<div className={style.section5_bottom_title}>
							<AnimatedNumbers
								includeComma
								animateToNumber={76.9}
								fontStyle={{fontSize: 64}}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
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
								fontStyle={{fontSize: 64}}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
								]}
							></AnimatedNumbers>
							<span>in</span>
							<AnimatedNumbers
								animateToNumber={5}
								fontStyle={{fontSize: 64}}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 50},
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
								fontStyle={{fontSize: 64}}
								locale="en-US"
								configs={[
									{mass: 1, tension: 220, friction: 100},
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
	)
}

export default Section5