import style from '../index.module.scss';
import React, {useContext, useEffect} from 'react';
import {useInView} from 'react-intersection-observer';
import classNames from 'classnames';
import Title from "./Title";
import useWindowSize from "../../../../hooks/useWindowSize";
import Image from 'next/image';
import {languageContext} from "../../components/providers/languageProvider";

// const dialog = [
// 	{
// 		"name": "John",
// 		"message": "Hi Sarah, I'm interested in the position. Could you provide more information about the role?"
// 	},
// 	{
// 		"name": "Sarah",
// 		"message": "Hi John, your profile is an excellent match for the role. I'd be happy to provide more details. What specifically would you like to know?"
// 	},
// 	{
// 		"name": "John",
// 		"message": "Can you tell me more about the company culture and team I'd be working with?"
// 	},
// 	{
// 		"name": "Sarah",
// 		"message": "Sure. Our company culture is collaborative and team-oriented, and we pride ourselves on creating a supportive work environment. You'd be working with a talented and diverse team of professionals who are passionate about what they do."
// 	},
// 	{
// 		"name": "John",
// 		"message": "That sounds great. I'd love to learn more about the next steps in the application process."
// 	},
// 	{
// 		"name": "Sarah",
// 		"message": "Excellent. Our next step would be to schedule a phone interview. How does next Tuesday at 2:00pm work for you?"
// 	},
// 	{
// 		"name": "John",
// 		"message": "That works perfectly. Thank you, Sarah."
// 	},
// 	{
// 		"name": "Sarah",
// 		"message": "Thank you, John. I look forward to speaking with you next week."
// 	}
// ]

const Section1 = () => {
	const { ref, inView, entry } = useInView({
		/* Optional options */
		threshold: 1,
	});


	const {width} = useWindowSize();
	const isMobile = width < 540;
	return <div className={style.section1Wrapper}>
		<div className={style.section_bg + ' ' + style.mobile}></div>
		<div className={style.sectionContainer}>
			<div className={style.section_bg + ' ' + style.desktop}></div>
			{isMobile && <Title />}
			{/* <section className={style.section1}> */}
			{/* 	{!isMobile && <Title/>} */}
			{/* 	<div className={style.phone + ' ' + style.desktop} id={'phone'} > */}
			{/* 		<img src={`${process.env.S3_BUCKET_URL}/landing/phone.png`} alt="phone" */}
			{/* 		     className={style.phone_img}/> */}
			{/* 	</div> */}
			{/* 	<img className={style.rocket + ' ' + style.desktop} alt="rocket" src={`${process.env.S3_BUCKET_URL}/landing/rocket.png`}/> */}
			{/* 	<img className={style.phone_eyes + ' ' + style.desktop} src={`${process.env.S3_BUCKET_URL}/landing/eyes.png`} alt="eyes img"/> */}
			{/* </section> */}
			<section className={style.section1_new + ' ' + style.desktop}>
				{!isMobile && <div className={style.absolute_center}><Title /></div>}
				<div className={style.section1_phone_wrapper}>
					<Image src={`${process.env.S3_BUCKET_URL}/landing/phone1-final-3.png`} alt="" className={style.section1_phone}
					       width={1884}
					       height={1127}
					/>
					<img className={style.rocket + ' ' + style.desktop} alt="rocket"
						src={`${process.env.S3_BUCKET_URL}/landing/rocket.png`} />
					<img className={style.phone_eyes + ' ' + style.desktop} src={`${process.env.S3_BUCKET_URL}/landing/eyes.png`}
						alt="eyes img" />
				</div>
			</section>
			<PopStream />
		</div>

	</div>

}

export default Section1


const PopStream = () => {
	const contextLang =  useContext(languageContext);

	const dialog = [];
	const name1 = contextLang.landing["section1_name1"];
	const name2 = contextLang.landing["section1_name2"];

	if (name1 && name2) {
		for (let i = 1; i <= 8; i++) {
			const messageKey = `section1_message${i}`;
			const message = contextLang.landing[messageKey];

			if (message) {
				const name = i % 2 === 1 ? name1 : name2;
				dialog.push({ name, message });
			}
		}
	}

	return <div className={style.streamWrapper}>
		<img src={`${process.env.S3_BUCKET_URL}/landing/mobile-section1-stream-pop.png`} alt={'png'}
			className={style.mobile + " " + style.stream_top} />
		{
			dialog.map((item, index) => {
				return <Pop key={index} type={index % 2 == 0  ? 'left' : 'right'} text={item.message}/>
			})
		}
	</div>
}

const Pop = (props: { type: 'left' | 'right', text: string }) => {
	const { type, text } = props
	const { ref, inView, entry } = useInView({
		/* Optional options */
		threshold: 0,
		rootMargin: '0px 0px 50px 0px',
	});
	// useEffect(()=>{
	// 	entry?.target?.addEventListener('scroll', function() {
	// 		// 输出元素当前的滚动位置
	// 		console.log('Element has been scrolled to: ',entry.target, + entry.boundingClientRect.top);
	// 	});
	// },[entry]);
	if (type === 'left') {
		return <div className={classNames({
			[style.content]: true,
			[style.animate__bounceIn]: inView
		})} ref={ref}>
			<div className={style.popWrapper}>
				<div className={style.avatar}>
					<img src={`${process.env.S3_BUCKET_URL}/landing/avatar1.png`} alt="avatar img" />
				</div>
				<div className={style.pop_left}>
					{text}
				</div>
			</div>
		</div>
	}
	return <div className={classNames({
		[style.content]: true,
		[style.animate__bounceIn]: inView
	})} ref={ref}>
		<div className={style.popWrapper + ' ' + style.content_right}>
			<div className={style.pop_right}>
				{text}
			</div>
			<div className={style.avatar}>
				<img src={`${process.env.S3_BUCKET_URL}/landing/avatar2.png`} alt="avatar img" />
			</div>
		</div>
	</div>
}