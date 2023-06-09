'use client'
import style from '../index.module.scss';
import Typical from 'react-typical'
import {useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
import Link from 'next/link';

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
		<p className={style.title + ' ' + style.height}>
			{show && <Typical
		  steps={['connect you with decision makers in real-time']}
	  />}
		</p>
		<div className={style.getApp + ' ' + style.mobile}>
			<div className={style.download_btn}>
				<span>
					Get the app 👈
				</span>
			</div>
		</div>
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