import React from 'react';
import style from "./index.module.scss";



interface SectionProps extends React.PropsWithChildren{
	split?: boolean;
	title: string;
}

export default function Section(props: SectionProps) {
	return <section className={style.section} >
		<div className={style.title_layout}>
			<div className={style.title}>{
				props.title
			}</div>
			<div className={style.tag}></div>
		</div>
		<div className={style.section_content_wrapper}>
			{props.children}
		</div>
		{props.split && <div className={style.split}></div>}
	</section>
}