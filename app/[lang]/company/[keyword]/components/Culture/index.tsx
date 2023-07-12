import React, {PropsWithChildren} from 'react';
import style from './index.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import Image from 'next/image'
import { CompanyDetailsType } from '../../service';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { MouseOverPopover } from '../InfoList';
import { languageContext } from 'app/components/providers/languageProvider';



interface Props extends PropsWithChildren<CompanyDetailsType> {
	test?: number;
	type?: 'benefits' | 'culture' 
}

const CulturePanel = (props: Props) => {
	const {benefits,cultures} = props;
	const contextLang = React.useContext(languageContext);
	const { overview , culture} = contextLang.companyDetail;
	if(!cultures?.length &&  !benefits.length) return null;
	return <div className={style.culture_wrapper}>
		<div className={style.culture_title}>{overview.CultureAndBenefits}</div>
		<div className={style.culture_content}>
			{overview.BenefitsDes}
		</div>
		{
			!!cultures?.length && <>
				<div className={style.subtitle}>{overview.culture.title}</div>
				<div className={style.item_wrapper + ' ' + style.culture}>
					{cultures.map((item,index)=>{
						return <MouseOverPopover value={item.value} className={style.item} key={index}></MouseOverPopover>
					})}
				</div>
			</>
		}
		{
			!!benefits?.length && <>
				<div className={style.subtitle}>{overview.CompanyBenefits}</div>
				<div className={style.item_wrapper}>
					{benefits.map((item,index)=>{
						return <MouseOverPopover value={item.value} className={style.item} key={index}></MouseOverPopover>
					})}
				</div>
			</>
		}
	</div>
}

export function TagContent(props: Props){
	const {cultures , benefits} = props;
	const _data = props.type === 'benefits'  ? benefits : cultures;
	if(!_data?.length) return null;
	return <div className={style.culture_wrapper}>
		<div className={classNames({
			[style.item_wrapper]: true,
			[style.culture]: props.type !== 'benefits'
		})}>
			{_data.map((item,index)=>{
				return <MouseOverPopover value={item.value} className={style.item} key={index}></MouseOverPopover>
			})}
		</div>
	</div>
}

export function SocialMedia(props: Props){
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

	const contextLang = React.useContext(languageContext);
	const { overview } = contextLang.companyDetail;
	if(res.length === 0) return null;
	return <div className={style.culture_wrapper + ' ' + style.social_}>
		<div className={style.culture_title} style={{marginBottom: 30}}>{overview.socialMedia}</div>
		<div className={style.social_wrapper}>
			{res.map((item,index)=>{
				return <div key={index} className={style.social_item}>
					<Link  target='__blank' href={item.link} title={item.link}>
						<div className={style.social_icon}>
							<Image width={28} height={28} src={item.icon} alt="icon" />
						</div>
					</Link>
					{/* <Link className={style.link_text} target='__blank' href={item.link} title={item.link}>
						{item.link}
					</Link> */}
				</div>
			})}
		</div>

	</div>
}


export default CulturePanel;