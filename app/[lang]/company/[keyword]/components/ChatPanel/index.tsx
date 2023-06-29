import * as React from 'react';
import style from './index.module.scss';
import { Recruiter } from "../../service";
import Image from 'next/image'


const ChatPanel =  (props: {
	list: Recruiter[]
}) => {
	return <div className={style.wrapper}>
		<div className={style.title}>
			Hi Boss
		</div>
		<div className={style.chatList}>
			{props.list.map((item, index)=>{
				return <ChatItem key={index} {...item}/>
			})}
		</div>
	</div>
}

const ChatItem = (props: Recruiter) => {
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