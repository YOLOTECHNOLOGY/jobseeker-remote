'use client';
import React, {useEffect, useState, useRef, useContext} from "react";
import style from '../../index.module.scss';
import Link from 'next/link'
import {useInView, InView } from "react-intersection-observer";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller} from 'swiper';

import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import useWindowSize from "../../../../../hooks/useWindowSize";
import classNames from "classnames";
import {languageContext} from "../../../components/providers/languageProvider";


let carouselList = [
	{
		index:1,
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image.png`,
		des: 'Bossjob attracts 2.9 million users in PHL, secures $5m funding to boost globalization efforts',
		date: '27 May 2023',
		link: 'https://www.dailyguardian.com.ph/bossjob-attracts-2-9-million-users-in-phl-secures-5m-funding-to-boost-globalization-efforts/',
	},
	{
		index:2,
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image4.png`,
		des: 'Filipino job search platform Bossjob secures US$5M in venture funding',
		date: '25 May 2023',
		link: 'https://e27.co/filipino-job-search-platform-bossjob-secures-us5m-in-venture-funding-20230525/'
	},
	{
		index:3,
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image3.png`,
		des: 'Grab Ventures Ignite helps Singaporean startup Bossjob kickstart in Vietnam',
		date: '23 Apr 2021',
		link: 'https://blog.bossjob.com/press-room/1524/grab-ventures-ignite-helps-singaporean-startup-bossjob-kickstart-in-vietnam/ '
	},
]
carouselList = carouselList.concat(carouselList)

const seeAllLink = 'https://blog.bossjob.com/';
const Section7 = () => {
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const swiperRef = useRef(null);
	const contextLang = useContext(languageContext);
	const isMobile = width < 540;
	return <div className={style.section7}>
		<div className={style.section7_title}>
			<Link style={{opacity: 0}}
			      target="_blank"
			      href={seeAllLink}
			      className={style.link + ' ' + style.desktop}>
				See all
			</Link>
			<span>{contextLang.landing.section7_title}</span>
			<Link target="_blank" href={seeAllLink} className={style.link + ' ' + style.desktop}>
				{contextLang.landing.section7_see_all}
			</Link>
		</div>
		{!isMobile ? <div className={style.section7_carousel}
		                  onMouseLeave={() => {setEnable(false)}}
		                  onMouseEnter={() => {setEnable(true)}}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
				scrollbar={{draggable: true}}
				spaceBetween={50}
				ref={swiperRef}
				slidesPerView={3.3}
				autoplay={{
					delay: 2000,
					disableOnInteraction: true
				}}
				navigation={enable}
				loop={true}
			>
				{
					carouselList.map((item, index) => {
						return <SwiperSlide key={index}>
							<div className={style.slideItem + " " + style.cursor_pointer} onClick={()=>{
								window.open(item.link)
							}}>
								<div className={style.section7_new_pic}>
									<img src={item.img} alt="img" className={style.section7_new_inner_pic}/>
								</div>
								<div className={style.section7_news_des}>
									{contextLang.landing[`section7_list_des${item.index}`] ||  item.des}
								</div>
								<div className={style.section7_date}>
									{contextLang.landing[`section7_list_date${item.index}`] ||  item.date}
								</div>
							</div>
						</SwiperSlide>
					})
				}
			</Swiper>
		</div> : null}
		{isMobile ? <div className={style.section7_mobile_carousel}>
			{carouselList.slice(0,3).map((item,index)=>{
				return 	<InView delay={200} threshold={0.3} key={index}>
					{({inView, ref })=>(
						<div className={classNames({
							[style.slideItem]: true,
							[style.animate__bounceIn]: inView,
						})} ref={ref} onClick={()=>{
							window.open(item.link);
						}}>
							<div className={style.section7_new_pic}>
								<img src={item.img} alt="img" className={style.section7_new_inner_pic}/>
							</div>
							<div className={style.section7_news_des}>
								{contextLang.landing[`section7_list_des${item.index}`] ||  item.des}
							</div>
							<div className={style.section7_date}>
								{contextLang.landing[`section7_list_date${item.index}`] ||  item.date}
							</div>
						</div>
					)}
				</InView>
			})}
			<Link target="_blank"
			      href={seeAllLink}
			      style={{marginLeft: '.2rem', textAlign: 'left'}}
			      className={style.link + ' ' + style.mobile}>
				{contextLang.landing.section7_see_all}
			</Link>
		</div> : null}

	</div>
}

export default Section7