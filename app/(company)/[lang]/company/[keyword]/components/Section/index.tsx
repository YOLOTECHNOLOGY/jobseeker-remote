import * as React from 'react';
import style from "./index.module.scss";



interface SectionProps extends React.PropsWithChildren{
	split?: boolean;
	title: string;
	hot?: boolean;
}

export default function Section(props: SectionProps) {
	return <section className={style.section} >
		<div className={style.title_layout}>
			<div className={style.title}>{
				props.title
			}</div>
			{props.hot && <div className={style.tag}><span>HOT</span></div>}
		</div>
		<div className={style.section_content_wrapper}>
			{props.children}
		</div>
		{props.split && <div className={style.split}></div>}
	</section>
}