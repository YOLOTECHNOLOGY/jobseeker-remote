'use client';
import {useRef, useContext} from "react";
import style from '../../index.module.scss';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller} from 'swiper';

import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import {languageContext} from "../../../../components/providers/languageProvider";
import useWindowSize from "../../../../../hooks/useWindowSize";



const Section8 = () => {
	const swiperRef = useRef(null)
	const contextLang = useContext(languageContext);
	const carouselList = [
		{
			des: `${contextLang.landing["Looking for"]} <i style="color: #FED766">${contextLang.landing.talents}</i>? 👀`,
			link: 'https://employer.bossjob.com/'
		},
		{
			des: `${contextLang.landing["Looking for"]} <i style="color: #FED766">${contextLang.landing.jobs}</i>?  💼`,
			link: 'https://bossjob.com'
		},
	]
	const {width} = useWindowSize();
	return <div className={style.section8}>
		<div className={style.section8_carousel + ' ' + style.desktop}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
				spaceBetween={35}
				ref={swiperRef}
				slidesPerView={width / 620}
				speed={4000}
				autoplay={{
					delay: 0,
				}}
				loop={true}
				scrollbar={{draggable: true}}
			>
				{
					carouselList.concat(carouselList).concat(carouselList).map((item,index)=>{
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

export default Section8