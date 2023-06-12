'use client';
import React, {useEffect, useState, useRef} from "react";
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


const carouselList = [
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image.png`,
		des: 'Bossjob attracts 2.9 million users in PHL, secures $5m funding to boost globalization efforts',
		date: '28 May 2023',
		link: 'https://www.dailyguardian.com.ph/bossjob-attracts-2-9-million-users-in-phl-secures-5m-funding-to-boost-globalization-efforts/',
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image4.png`,
		des: 'Grab Ventures Ignite helps Singaporean startup Bossjob kickstart in Vietnam',
		date: '28 May 2023',
		link: 'https://e27.co/filipino-job-search-platform-bossjob-secures-us5m-in-venture-funding-20230525/'
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image3.png`,
		des: 'Grab Ventures Ignite helps Singaporean startup Bossjob kickstart in Vietnam',
		date: '28 May 2023',
		link: 'https://blog.bossjob.com/press-room/1524/grab-ventures-ignite-helps-singaporean-startup-bossjob-kickstart-in-vietnam/ '
	},
	{
		img: `${process.env.S3_BUCKET_URL}/landing/section7-news-image.png`,
		des: 'Bossjob attracts 2.9 million users in PHL, secures $5m funding to boost globalization efforts',
		date: '28 May 2023',
		link: 'https://www.dailyguardian.com.ph/bossjob-attracts-2-9-million-users-in-phl-secures-5m-funding-to-boost-globalization-efforts/',
	}
]
const Section7 = () => {
	const [enable, setEnable] = useState(true);
	const {width} = useWindowSize();
	const swiperRef = useRef(null)
	const isMobile = width < 540;
	return <div className={style.section7}>
		<div className={style.section7_title}>
			<Link style={{opacity: 0}}
			      target="_blank"
			      href={'https://blog.bossjob.com/'}
			      className={style.link + ' ' + style.desktop}>
				See all
			</Link>
			<span>Bossjob is in the news</span>
			<Link target="_blank" href={'https://blog.bossjob.com/'} className={style.link + ' ' + style.desktop}>See all</Link>
		</div>
		{!isMobile ? <div className={style.section7_carousel}
		                  onMouseLeave={(event) => {
			                  console.log('onMouseLeave');
			                  // swiperRef.current.swiper.autoplay.start();
			                  setEnable(false)
		                  }}
		                  onMouseEnter={(event) => {
			                  console.log('onMouseEnter');
			                  // swiperRef.current.swiper.autoplay.pause();
			                  setEnable(true);
		                  }}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
				spaceBetween={50}
				ref={swiperRef}
				slidesPerView={3.3}
				autoplay={{
					delay: 1000,
					disableOnInteraction: true
				}}
				draggable={true}
				navigation={enable}
				loop={true}
				scrollbar={{draggable: true}}
			>
				{
					carouselList.concat(carouselList).map((item, index) => {
						return <SwiperSlide key={index}>
							<div className={style.slideItem} onClick={()=>{
								window.open(item.link)
							}}>
								<div className={style.section7_new_pic}>
									<img src={item.img} alt="img" className={style.section7_new_inner_pic}/>
								</div>
								<div className={style.section7_news_des}>
									{item.des}
								</div>
								<div className={style.section7_date}>
									{item.date}
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
								{item.des}
							</div>
							<div className={style.section7_date}>
								{item.date}
							</div>
						</div>
					)}
				</InView>
			})}
			<Link target="_blank"
			      href={'https://blog.bossjob.com/'}
			      style={{marginLeft: '.2rem', textAlign: 'left'}}
			      className={style.link + ' ' + style.mobile}>
				See all
			</Link>
		</div> : null}

	</div>
}

export default Section7