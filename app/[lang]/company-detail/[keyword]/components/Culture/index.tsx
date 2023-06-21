import React from 'react';
import style from './index.module.scss';


const CulturePanel = () => {
	return <div className={style.culture_wrapper}>
		<div className={style.culture_title}>Culture and benefits</div>
		<div className={style.culture_content}>
			Benefits are provided by the company and may
			vary depending on the position.
		</div>

		<div className={style.subtitle}>Company culture</div>
		<div className={style.item_wrapper}>

		</div>
		<div style={{height: 36}}/>
		<div className={style.subtitle}>Company culture</div>
		<div className={style.item_wrapper}>

		</div>
	</div>
}


export default CulturePanel;