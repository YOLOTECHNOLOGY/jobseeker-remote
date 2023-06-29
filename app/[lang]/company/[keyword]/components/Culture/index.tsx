import React, {PropsWithChildren} from 'react';
import style from './index.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import Image from 'next/image'
import { CompanyDetailsType } from '../../service';


interface Props extends PropsWithChildren<CompanyDetailsType> {
	test?: number;
}

const CulturePanel = (props: Props) => {
	const {benefits,cultures} = props;
	return <div className={style.culture_wrapper}>
		<div className={style.culture_title}>Culture and benefits</div>
		<div className={style.culture_content}>
			Benefits are provided by the company and may
			vary depending on the position.
		</div>
		{
			cultures?.length && <>
				<div className={style.subtitle}>Company culture</div>
				<div className={style.item_wrapper + ' ' + style.culture}>
					{cultures.map((item,index)=>{
						return <div className={style.item} key={index}><span>{item.value}</span></div>
					})}
					
				</div>
			</>
		}
		{
			benefits?.length && <>
				<div className={style.subtitle}>Company benefits</div>
				<div className={style.item_wrapper}>
					{benefits.map((item,index)=>{
						return <div className={style.item} key={index}><span>{item.value}</span></div>
					})}
				</div>
			</>
		}



	</div>
}

export function SocialMedia(props: Props){
	const {} = props;
	const arr = [{
		icon: require('../assets/facebook.svg').default.src,
		link: props.facebook_url,
	},{
		icon: require('../assets/inlink.svg').default.src,
		link: props.linkedin_url
	},{
		icon: require('../assets/ins.svg').default.src,
		link: props.instagram_url
	},{
		icon: require('../assets/youtube.svg').default.src,
		link: props.youtube_url,
	},{
		icon: require('../assets/twitter.svg').default.src,
		link: props.twitter_url
	}];
	const res = arr.filter(item=>item.link);
	if(res.length === 0) return null;
	return <div className={style.culture_wrapper}>
		<div className={style.culture_title} style={{marginBottom: 30}}>Social media</div>
		{res.map((item,index)=>{
			return <div key={index} className={style.social_item}>
				<div className={style.social_icon}>
					<Image width={28} height={28} src={item.icon} alt="icon" />
				</div>
				<Link className={style.link_text} target='__blank' href={item.link}>
					{item.link}
				</Link>
			</div>
		})}
	</div>
}


export default CulturePanel;