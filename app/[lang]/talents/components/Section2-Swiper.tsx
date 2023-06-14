import style from '../index.module.scss';
import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";
import AutoScroll from './AutoScrollList'

let imgs = [
	`${process.env.S3_BUCKET_URL}/landing/1.svg`,
	`${process.env.S3_BUCKET_URL}/landing/2.svg`,
	`${process.env.S3_BUCKET_URL}/landing/3.svg`,
	`${process.env.S3_BUCKET_URL}/landing/4.svg`,
	`${process.env.S3_BUCKET_URL}/landing/5.svg`,
	`${process.env.S3_BUCKET_URL}/landing/6.svg`,
	`${process.env.S3_BUCKET_URL}/landing/7.svg`,
	`${process.env.S3_BUCKET_URL}/landing/8.svg`,
	`${process.env.S3_BUCKET_URL}/landing/9.svg`,
	`${process.env.S3_BUCKET_URL}/landing/10.svg`,
	`${process.env.S3_BUCKET_URL}/landing/11.svg`,
	`${process.env.S3_BUCKET_URL}/landing/12.svg`,
	`${process.env.S3_BUCKET_URL}/landing/13.svg`,
	`${process.env.S3_BUCKET_URL}/landing/14.svg`,
	`${process.env.S3_BUCKET_URL}/landing/15.svg`,
	`${process.env.S3_BUCKET_URL}/landing/16.svg`,

]
imgs = imgs.concat(imgs);
const Section2 = () => {
	const [enable, setEnable] = useState(true);

	const swiperRef = useRef(null)
	return <section className={style.section2}>
		<Swiper
			modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Controller]}
			spaceBetween={80}
			ref={swiperRef}
			grabCursor={true}
			slidesPerView={9}
			// centeredSlides={true}
			autoplay={{
				delay: 2000,
				disableOnInteraction: true
			}}
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
			{imgs.map((item, index) => {
				return (
					<SwiperSlide key={index}>
						<div className={style.section2Item}>
							<img src={item} alt="index" className={style.section2_img}/>
						</div>
					</SwiperSlide>

				)
			})}
		</Swiper>


	</section>
}

export default Section2