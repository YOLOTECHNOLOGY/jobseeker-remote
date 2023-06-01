'use client'
import style from '../index.module.scss';
import Typical from 'react-typical'
import {useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
export const Title = ()=> {

	const  [show, setShow]  = useState(false);
	const {ref, inView, entry} = useInView({
		/* Optional options */
		threshold: 1,
		delay: 2000
	});
	useEffect(()=>{
		setTimeout(()=>{
			setShow(true);
		},2000);
	},[]);
	return <div className={style.titleWrapper} ref={ref}>
		<p className={style.title + ' ' + style['title-color']} style={{height: 108}}>
			<Typical
				steps={['AI Hiring APP']}
			/>
		</p>
		<p className={style.title + ' ' + style.height} >
			{inView && show && <Typical
		  steps={['connect you with decision makers in real-time']}
	  />}
		</p>
		<div className={style.boxWrapper}>
				<div className={style.download_btn}>
				<span>
					Apple store
				</span>
					<img src={require('./svg/apple.svg').default.src} alt={'apple'}/>
				</div>
			<div className={style.download_btn + ' ' + style.google }>
				<span>Google play</span>
				<img src={require('./svg/google.svg').default.src} alt={'google'}/>
			</div>
			<div className={style.qrcode}></div>
		</div>


	</div>

}

export default Title;