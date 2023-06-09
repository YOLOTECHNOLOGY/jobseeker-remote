import style from '../../index.module.scss';
import React, {useEffect, useCallback, useState} from 'react';
import {useInView, InView } from "react-intersection-observer";
import classNames from "classnames";
import useWindowSize from "../../../../../hooks/useWindowSize";


const INFO = [
	{
		title: 'Chat and\n' +
			'get hired',
		des: 'Quickly connect with hiring managers on the go. You can secure interviews and offers at lightning speed, saving time and simplifying your job search!'
	},
	{
		title: 'Discover your\n' +
			'perfect career \n' +
			'match',
		des: 'Our next-gen AI delivers personalised job recommendations that continuously learn and evolve over time, ensuring you always have the most relevant job opportunities.',
	},
	{
		title: 'Elevate your\n' +
			'personal brand\n' +
			'with Chat-GPT',
		des: 'Leverage the most advanced technology - ChatGPT - to help you build personalised a resume & statement that highlight your unique skills, setting you apart from others! '
	},
	{
		title: 'Find your ideal\n' +
			'workplace',
		des: 'We provide a window into a company\'s culture and values, so you can determine if they align with your own, empowering you to find ideal workplace to thrive!'
	}
]

const section4_phone_img = [
	`${process.env.S3_BUCKET_URL}/landing/section4_iphone_1.png`,
	`${process.env.S3_BUCKET_URL}/landing/section4_iphone_2.png`,
	`${process.env.S3_BUCKET_URL}/landing/section4_iphone_3.png`,
	`${process.env.S3_BUCKET_URL}/landing/section4_iphone_4.png`,
]
const Section4 = () => {
	const [visibleNumber, setVisibleNumber] = useState(0);
	const visibleHandle = useCallback((index) => {
		setVisibleNumber(index);
	}, []);
	const {width} = useWindowSize();
	console.log('width',width);
	if(width <= 540){
		return <section className={style.section4 + ' ' + style.mobile}>
			{INFO.map((item,index)=>{
				return <div className={style.section4_mobile_item} key={index}>
					<InView delay={200} threshold={0.3}>
						{({inView, ref })=>(
							<div ref={ref} className={classNames({
									[style.section4_mobile_item_title]: true,
									[style.animate__bounceIn]: inView
								})}>{item.title}</div>
						)}
					</InView>
					<InView delay={400} threshold={0.4}>
						{({inView, ref })=>(
							<div className={classNames({
								[style.section4_mobile_item_des]: true,
								[style.animate__bounceIn]: inView
							})} ref={ref}>{item.des}</div>
						)}
					</InView>
					<InView delay={200} threshold={0.2}>
						{({inView, ref })=>(
							<img className={classNames({
								[style.section4_mobile_img]: true,
								[style.animate__bounceIn]: inView
							})} alt={'img'} src={section4_phone_img[index]} ref={ref} />
						)}
					</InView>
				</div>
			})}
		</section>
	}
	return <section className={style.section4 + ' ' + style.desktop}>
			<div className={style.section4_sticky}>
				<div className={style.section4_sticky_bg}></div>
				<div className={style.section4_phone_bg}>
					<img alt={'phone'} src={`${process.env.S3_BUCKET_URL}/landing/section4_iphone_wapper.png`}
					     className={style.section4_sticky_phone_wrapper}/>
					{section4_phone_img.map((img, index) => {
						return <img alt={'phone'} key={index} src={img}
						            className={classNames({
							            [style.section4_sticky_phone_content_1]: true,
							            [style.animate__fadeOut]: visibleNumber !== index,
							            [style.animate__fadeIn]: visibleNumber === index,
						            })}
						/>
					})}
				</div>
			</div>
			<div className={style.section4_right_content}>
				{INFO.map((item, index) => {
					return <InfoComponent {...item} index={index} key={index} visibleHandle={visibleHandle}/>
				})}
			</div>
		</section>
}

const InfoComponent = (props: { index: number, title: string, des: string, visibleHandle: (args: number) => void }) => {
	const {ref, inView} = useInView({
		threshold: 0.8,
		rootMargin: '0px 0px 500px 0px'
	});
	useEffect(() => {
		if (inView) {
			props.visibleHandle(props.index);
		}
	}, [inView]);
	return <div ref={ref}
		// style={{background:  inView ? '#00ff00': '#ffffff'}}
		          className={style.section4_right_item} key={props.title}>
		<div className={style.section4_right_title}>{props.title}</div>
		<div className={style.section4_right_des}>{props.des}</div>

	</div>
}

export default Section4