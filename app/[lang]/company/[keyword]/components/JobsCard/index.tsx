import React, { useLayoutEffect, useRef } from "react";
import style from "./jobcard.module.scss"
import { JobData } from "../../service";
import Link from "next/link"
import { useCompanyDetail } from "../../DataProvider";


const JobCard = (props: JobData) =>{
    const host =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window?.location.host
    const {lang} = useCompanyDetail();
    return <div className={style.card_container}>
        <div className={style.card_title}>
            {props.function_job_title}
        </div>
        <div className={style.card_content}>
            <div className={style.card_info_list}>
                <div className={style.card_salary}>
                    {props.local_salary_range_value}
                </div>
                <div className={style.card_info_extra}></div>
            </div>

            <div className={style.card_chat_container}>
                <div className={style.card_chat_wrapper}>
                    <img src={props.recruiter_avatar} className={style.recruiter_avatar}/>
                    <div className={style.card_chat_content}>
                        <div className={style.card_chat_title}>
                            {props.recruiter_full_name}
                        </div>
                        <div className={style.card_chat_name}>
                            {props.recruiter_job_title}
                        </div>
                    </div>
                </div>
                <Link href={host + '/' + lang + props.job_url} target="_blank">
                    <div className={style.chat_now}>
                        Chat Now
                    </div>
                </Link>
            </div>
            
        </div>
    </div>
}



export default JobCard;