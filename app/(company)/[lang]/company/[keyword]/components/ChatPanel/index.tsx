import * as React from 'react';
import style from './index.module.scss';
import { Recruiter } from "../../service";
import Image from 'next/image'
import { languageContext } from 'app/components/providers/languageProvider';


const ChatPanel =  (props: {
	list: Recruiter[]
}) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const [contentHeight, setContentHeight] = React.useState(150);
	const handleClick = () => {
		setIsVisible(!isVisible)
	}
	const contentRef = React.useRef(null);
	const calculateContentHeight = () => {
		setContentHeight(contentRef.current.scrollHeight);
	};
	React.useLayoutEffect(() => {
		calculateContentHeight();
	});
	const _resArr = props.list;
	const showMore = _resArr.length > 4;

	const contextLang = React.useContext(languageContext);
	const { overview, tab } = contextLang.companyDetail;
	return <div className={style.wrapper}>
		<div className={style.title}>
			{overview.HiBoss}
		</div>
		<div className={style.animation_wrapper} style={{
			height: !isVisible ?  !showMore ? '' :280 : contentHeight
			}}>
			<div className={style.chatList} ref={contentRef}>
				{props.list.map((item, index)=>{
					return <ChatItem key={index} {...item}/>
				})}
			</div>
		</div>
		{showMore && <div className={style.more} onClick={handleClick}>{isVisible ? overview.Less: overview.More}</div>}
	</div>
}

export const ChatItem = (props: Recruiter) => {
	return <div className={style.chatItem}>
		<Image width={48} height={48} className={style.chatHeader} src={props.avatar} alt="avatar"/>
		<div className={style.chatContent}>
			<div className={style.chatTitle}>
				{props.full_name}
			</div>
			<div className={style.chatSubtitle}>
				{props.job_title}
			</div>
		</div>
	</div>
}


export default ChatPanel;