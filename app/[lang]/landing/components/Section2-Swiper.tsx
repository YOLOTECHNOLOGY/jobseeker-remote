import style from '../index.module.scss';
import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";

let imgs = [
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-01.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-02.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-03.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-04.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-05.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-06.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-07.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-08.png"`,
	`${process.env.S3_BUCKET_URL}/landing/section1-carousel-09.png"`,
]
imgs = imgs.concat(imgs);
const Section2 = () =>{
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
		{imgs.map((item,index)=>{
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