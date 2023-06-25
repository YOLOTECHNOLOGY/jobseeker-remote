import * as React from 'react';
import style from './index.module.scss';


const ChatPanel = () => {
	return <div className={style.wrapper}>
		<div className={style.title}>
			Hi Boss
		</div>
		<div className={style.chatList}>
			<ChatItem></ChatItem>
			<ChatItem></ChatItem>
			<ChatItem></ChatItem>
			<ChatItem></ChatItem>
			<ChatItem></ChatItem>
		</div>
	</div>
}

const ChatItem = () => {
	return <div className={style.chatItem}>
		<div className={style.chatHeader}>

		</div>
		<div className={style.chatContent}>
			<div className={style.chatTitle}>
				test1
			</div>
			<div className={style.chatSubtitle}>
				test2
			</div>
		</div>
	</div>
}


export default ChatPanel;