import React from 'react';
import style from './index.module.scss';
import classNames from 'classnames';


const CulturePanel = () => {
	return <div className={style.culture_wrapper}>
		<div className={style.culture_title}>Culture and benefits</div>
		<div className={style.culture_content}>
			Benefits are provided by the company and may
			vary depending on the position.
		</div>

		<div className={style.subtitle}>Company culture</div>
		<div className={style.item_wrapper + ' ' + style.culture}>
			<div className={style.item}><span>Ecommerce</span></div>
			<div className={style.item}><span>Ecommerce</span></div>
			<div className={style.item}></div>
			<div className={style.item}></div>
			<div className={style.item}></div>
		</div>
		<div className={style.subtitle}>Company benefits</div>
		<div className={style.item_wrapper}>
			<div className={style.item}>
				<span>Ecommerce</span>
			</div>
			<div className={style.item}>
				<span>Ecommerce</span>
			</div>
			<div className={style.item}></div>
			<div className={style.item}></div>
		</div>
	</div>
}


export default CulturePanel;