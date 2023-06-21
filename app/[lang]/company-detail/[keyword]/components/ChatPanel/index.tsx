import * as React from 'react';
import style from './index.module.scss';


const CulturePanel = () => {
	return <div className={style.wrapper}>
		<div className={style.title}>

		</div>
		<div className={style.chatList}>
			<div className={style.chatItem}>
				<div className={style.chatHeader}>

				</div>
				<div className={style.chatContent}>
					<div className={style.chatTitle}></div>
					<div className={style.chatSubtitle}></div>
				</div>
			</div>
		</div>
	</div>
}


export default CulturePanel;