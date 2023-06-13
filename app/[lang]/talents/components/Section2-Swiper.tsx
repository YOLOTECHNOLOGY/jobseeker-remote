import style from '../index.module.scss';
import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar} from "swiper";
import AutoScroll from './AutoScrollList'

let imgs = [
	require('./AssetsLocal/1.svg').default.src,
	require('./AssetsLocal/2.svg').default.src,
	require('./AssetsLocal/3.svg').default.src,
	require('./AssetsLocal/4.svg').default.src,
	require('./AssetsLocal/5.svg').default.src,
	require('./AssetsLocal/6.svg').default.src,
	require('./AssetsLocal/7.svg').default.src,
	require('./AssetsLocal/8.svg').default.src,
	require('./AssetsLocal/9.svg').default.src,
	require('./AssetsLocal/10.svg').default.src,
	require('./AssetsLocal/11.svg').default.src,
	require('./AssetsLocal/12.svg').default.src,
	require('./AssetsLocal/13.svg').default.src,
	require('./AssetsLocal/14.svg').default.src,
	require('./AssetsLocal/15.svg').default.src,
	require('./AssetsLocal/16.svg').default.src,

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