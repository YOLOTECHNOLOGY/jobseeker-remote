'use client';
import style from '../index.module.scss';
import React from 'react';
import Typical from 'react-typical'
import {useInView , InView} from "react-intersection-observer";
import classNames from 'classnames'
import Image from 'next/image'
const Section3 = () => {
	const {ref, inView, entry} = useInView({
		/* Optional options */
		threshold: 0.3,
	});
	return <section className={style.section3} ref={ref}>
		<img className={style.section3_bg + ' ' + style.desktop} alt={'bg'} src={`${process.env.S3_BUCKET_URL}/landing/section3-bg.webp'`} />
		<img className={style.section3_bg + ' ' + style.mobile} alt={'bg'} src={`${process.env.S3_BUCKET_URL}/landing/mobile-section3-bg.png`} />
		<div className={style.content_container}>
			<div className={style.section3_title}>
				<p>
					Bossjob
				</p>
				{inView && <Typical steps={['a better & faster way to find jobs']}/>}
			</div>
			<div className={style.section3_content}>
				<div className={style.section3_left}>
					{Des_Schema.map(item=>{
						return <Section3LeftItem {...item} key={item.title}/>
					})}
				</div>
				<div className={style.section3_right}>
					<img src={`${process.env.S3_BUCKET_URL}/landing/section3-right-bg.png`} alt="section3_right-bg"
					     className={style.section3_right_bg + ' ' + style.desktop}
					/>
					<img src={`${process.env.S3_BUCKET_URL}/landing/mobile-section3.png`} alt={'bg'}
					     className={style.section3_right_mobile_bg + ' ' + style.mobile}
					/>
					<InView delay={200} threshold={0.3}>
						{({inView, ref })=>(
							<img ref={ref} src={`${process.env.S3_BUCKET_URL}/landing/section3-right-1.png`} alt="section3_right"
							     className={classNames({
								     [style.section3_right_chat_1]: true,
								     [style.animate__bounceIn]: inView
							     })} />
						)}
					</InView>
					<InView delay={400} threshold={0.3}>
						{({ref,inView})=>(
							<img ref={ref} src={`${process.env.S3_BUCKET_URL}/landing/section3-right-2.png`} alt="section3_right"
							     className={classNames({
								     [style.section3_right_chat_2]: true,
								     [style.animate__bounceIn]: inView
							     })}/>
						)}
					</InView>
					<InView delay={600} threshold={0.3}>
						{({ref,inView})=>(
							<img ref={ref} src={`${process.env.S3_BUCKET_URL}/landing/section3-right-3.png`} alt="section3_right"
							     className={classNames({
								     [style.section3_right_chat_3]: true,
								     [style.animate__bounceIn]: inView
							     })}/>
						)}
					</InView>
				</div>

			</div>
		</div>
	</section>
}

export default Section3

const Des_Schema = [
	{
		title: 'AI-powered job matching',
		des: 'Match jobs for you using Big data & AI models!',
		icon: `${process.env.S3_BUCKET_URL}/landing/section3-icon1.svg`
	},
	{
		title: 'Talk to Boss directly',
		des: 'Talk to hiring managers, bosses and decision makers during your job hunt.',
		icon: `${process.env.S3_BUCKET_URL}/landing/section3-icon2.svg`
	},
	{
		title: 'Mobile-first',
		des: 'Bossjob APP provides a seamless job hunting experience on the go.',
		icon: `${process.env.S3_BUCKET_URL}/landing/section3-icon3.svg`
	},
	{
		title: 'Real-time communication',
		des: 'Our built-in chat features enable instant engagement, from job application to interview, all done within minutes.',
		icon: `${process.env.S3_BUCKET_URL}/landing/section3-icon4.svg`
	}
]


const Section3LeftItem = (props: {
	title: string,
	des: string,
	icon: string
}) => {
	const {ref, inView, entry} = useInView({
		/* Optional options */
		threshold: 0.3,
	});
	return <div className={classNames({
		[style.section3_left_item]: true,
		[style.animate__bounceIn]: inView
	})} ref={ref}>
		<div className={style.section3_left_icon_box}>
			<img src={props.icon} alt={props.title}/>
		</div>
		<div className={style.section3_left_item_title_box}>
			<div className={style.section3_left_item_title}>{props.title}</div>
			<div className={style.section3_left_item_des}>{props.des}</div>
		</div>
	</div>
}