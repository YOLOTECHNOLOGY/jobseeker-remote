'use client'
import style from '../index.module.scss';
import Typical from 'react-typical'
import {useEffect, useState} from "react";
import {useInView, InView} from "react-intersection-observer";
import Link from 'next/link';
import classNames from 'classnames';

const androidUrl = 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp '
const iOSUrl = 'https://apps.apple.com/sg/app/bossjob/id1592073585'
export const Title = () => {

	const [show, setShow] = useState(false);
	const {ref, inView, entry} = useInView({
		/* Optional options */
		threshold: 1,
		delay: 2000
	});
	useEffect(() => {
		setTimeout(() => {
			setShow(true);
		}, 2000);
	}, []);
	return <div className={style.titleWrapper} ref={ref}>
		<p className={style.title + ' ' + style['title-color']} style={{height: 108}}>
			<Typical
				steps={['AI Hiring APP']}
			/>
		</p>
		<InView threshold={0.2}>
			{({inView, ref}) => {
				return <p ref={ref} className={classNames({
					[style.op0]: true,
					[style.title + ' ' + style.height]: true,
					[style.animate__bounceIn]: inView,
				})}>connect you with decision makers in real-time</p>
			}}
		</InView>

		<InView threshold={0.2}>
			{({inView, ref}) => {
				return <div ref={ref} className={classNames({
					[style.getApp + ' ' + style.mobile]: true,
					[style.animate__bounceIn]: inView,
				})}>
					<div className={style.download_btn} onClick={()=>{
						window.open('http://bossjob.ph/app');
					}}>
							Get the app 👈
					</div>
				</div>
			}}
		</InView>

		<div className={style.boxWrapper}>
			<Link className={style.download_btn} href={iOSUrl} target={'_blank'}>
				<span>
					Apple store
				</span>
				<img src={`${process.env.S3_BUCKET_URL}/landing/apple.svg`} alt={'apple'}/>
			</Link>
			<Link className={style.download_btn + ' ' + style.google} href={androidUrl} target={'_blank'}>
				<span>Google play</span>
				<img src={`${process.env.S3_BUCKET_URL}/landing/google.svg`} alt={'google'}/>
			</Link>
			<div className={style.qrcode}></div>
		</div>


	</div>

}

export default Title;