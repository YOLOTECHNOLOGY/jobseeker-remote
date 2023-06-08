'use client';
import {useEffect, useState, useRef} from "react";
import style from '../../index.module.scss';
import Link from 'next/link'
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller} from 'swiper';

import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";


const carouselList = [
	{
		des: `Looking for <span style="color: #FED766">talents</span>? 👀`,
		link: 'https://employer.bossjob.com/'
	},
	{
		des: `Looking for <span style="color: #FED766">jobs</span>?  💼`,
		link: 'https://bossjob.com/'
	},
	{
		des: `Looking for <span style="color: #FED766">talents</span>? 👀`,
		link: 'https://employer.bossjob.com/'
	},
	{
		des: `Looking for <span style="color: #FED766">jobs</span>?  💼`,
		link: 'https://bossjob.com/'
	},
	{
		des: `Looking for <span style="color: #FED766">talents</span>? 👀`,
		link: 'https://employer.bossjob.com/'
	},
	{
		des: `Looking for <span style="color: #FED766">jobs</span>?  💼`,
		link: 'https://bossjob.com/'
	},
]
const Section7 = () => {
	const swiperRef = useRef(null)
	return <div className={style.section8}>
		<div className={style.section8_carousel + ' ' + style.desktop}
		     onMouseLeave={(event) => {
			     console.log('onMouseLeave');
			     swiperRef.current.swiper.autoplay.start();
		     }}
		     onMouseEnter={(event) => {
			     console.log('onMouseEnter');
			     swiperRef.current.swiper.autoplay.pause();
		     }}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
				spaceBetween={50}
				ref={swiperRef}
				slidesPerView={2.3}
				grabCursor={true}
				autoplay={{
					delay: 1000,
					disableOnInteraction: true
				}}
				loop={true}
				scrollbar={{draggable: true}}
				onSlideChange={() => console.log('slide change')}

			>
				{
					carouselList.map((item,index)=>{
						return <SwiperSlide key={index}>
							<div className={style.section8_slideItem} onClick={()=>{window.open(item.link)}}>
								<div className={style.section8_des} dangerouslySetInnerHTML={{__html: item.des}}/>
							</div>
						</SwiperSlide>
					})
				}
			</Swiper>
		</div>

		<div className={style.section8_mobile_carousel + ' ' + style.mobile}>
			{carouselList.slice(0,2).map((item,index)=>{
				return <div key={index} className={style.section8_slideItem} onClick={()=>{window.open(item.link)}}>
					<div className={style.section8_des} dangerouslySetInnerHTML={{__html: item.des}}/>
				</div>
			})}
		</div>

	</div>
}

export default Section7