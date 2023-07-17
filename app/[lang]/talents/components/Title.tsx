'use client'
import style from '../index.module.scss';
import Typical from 'react-typical'
import { useLayoutEffect, useState, useMemo, useContext } from "react";
import { useInView, InView } from "react-intersection-observer";
import Link from 'next/link';
import classNames from 'classnames';
import { languageContext } from "../../../components/providers/languageProvider";
import Image from 'next/image'

const androidUrl = 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp '
const iOSUrl = 'https://apps.apple.com/sg/app/bossjob/id1592073585'





export const Title = () => {

	const [show, setShow] = useState(false);
	const { ref } = useInView({
		/* Optional options */
		threshold: 1,
		delay: 2000
	});

	useLayoutEffect(() => {
		setTimeout(() => {
			setShow(true);
		});
	})

	const contextLang = useContext(languageContext);

	const TypC = useMemo(() => {
		return <Typical steps={[contextLang.landing.section1_title]} wrapper={'h1'} />
	}, []);
	return <div className={style.titleWrapper} ref={ref}>
		<div className={style.title + ' ' + style['title-color']} style={{ height: 108 }}>
			{show && TypC}
		</div>
		<InView threshold={0.2} triggerOnce={true}>
			{({ inView, ref }) => {
				return <h1 ref={ref} className={classNames({
					[style.op0]: true,
					[style.section1_subtitle + ' ' + style.height]: true,
					[style.animate__bounceIn]: inView,
				})}>{contextLang.landing.section1_subtitle}</h1>
			}}
		</InView>

		<InView threshold={0.2} triggerOnce={true}>
			{({ inView, ref }) => {
				return <div ref={ref} className={classNames({
					[style.getApp + ' ' + style.mobile]: true,
					[style.animate__bounceIn]: inView,
				})}>
					<div className={style.download_btn} onClick={() => {
						window.open('http://bossjob.ph/app');
					}}>
						{contextLang.landing.section1_getApp} 👈
					</div>
				</div>
			}}
		</InView>

		<div className={style.boxWrapper}>
			<div>
				<Link className={style.download_btn} href={iOSUrl} target={'_blank'}>
					<span>
						Apple store
					</span>
					<img src={`${process.env.S3_BUCKET_URL}/landing/apple.svg`} alt={'apple'} />
				</Link>
			</div>
			<div>
				<Link className={style.download_btn + ' ' + style.google} href={androidUrl} target={'_blank'}>
					<span>Google play</span>
					<img src={`${process.env.S3_BUCKET_URL}/landing/google.svg`} alt={'google'} />
				</Link>
			</div>

			<div className={style.qrcode}>
				<Image
					src={`${process.env.S3_BUCKET_URL}/landing/qrcode_landing_title.png`}
					width={75}
					height={75}
					alt='_'
				/>
			</div>
		</div>


	</div>

}

export default Title;