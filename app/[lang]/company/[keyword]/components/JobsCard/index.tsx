import React from "react";
import style from "./jobcard.module.scss"
import { JobData } from "../../service";
import Link from "next/link"
import { useCompanyDetail } from "../../DataProvider";
import Image from 'next/image';
import { JobsTag } from "../SearchPanel";


const JobCard = (props: JobData) =>{
    const {lang} = useCompanyDetail();
    const link = '/' + lang + props.job_url;
    return <div className={style.card_container}>
        <Link className={style.card_title} href={link} target="_blank" title={props.job_title}>
            {props.job_title}
        </Link>
        <div className={style.card_content}>
            <div className={style.card_info_list}>
                <div className={style.card_salary}>
                    {props.local_salary_range_value}
                </div>
                <JobsTag {...props} count={3} />
                {/* <div className={style.card_info_extra}></div> */}
            </div>
            <div className={style.card_chat_container}>
                <div className={style.card_chat_wrapper}>
                    <Image src={props.recruiter_avatar} className={style.recruiter_avatar} 
                           width={40} height={40} alt={'alt'}/>
                    <div className={style.card_chat_content}>
                        <div className={style.card_chat_title}>
                            {props.recruiter_full_name}
                        </div>
                        <div className={style.card_chat_name}>
                            {props.recruiter_job_title}
                        </div>
                    </div>
                </div>
                <Link href={'/' + lang + props.job_url} target="_blank">
                    <div className={style.chat_now}>
                        Chat Now
                    </div>
                </Link>
            </div>
            
        </div>
    </div>
}



export default JobCard;