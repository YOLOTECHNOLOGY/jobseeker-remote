import React, { useCallback, useRef, useState } from 'react';
import style from './index.module.scss'
import { Country, JobData, fetchJobsListReq, getIDFromKeyword } from '../../service';
import Autocomplete from '@mui/material/Autocomplete';
import { flat } from 'helpers/formatter'
import Pagination from '@mui/material/Pagination';
import { useCompanyDetail } from '../../DataProvider';
import { debounce } from 'lodash-es'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Props  {
    list: Country[]
    functions: any[]

}


const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
const SearchPanel = (props:Props ) =>{
    const formattedLocationList = flat(formatLocationConfig(props.list));
    const params = useParams();
    const {jobsRes} = useCompanyDetail();
    const [jobsData, setJobsData] = useState(jobsRes);
    const [location, setLocation] = useState({});
    const inputText = useRef('');
    const [loading, setLoading] = useState(false);

    const id = getIDFromKeyword(params.keyword as any);
    const searchFunc = useCallback(debounce((jobTitle, location, page = 1)=>{
        
        setLoading(true);
        console.log('jobTitle, location',jobTitle, location);
        fetchJobsListReq({
            companyIds: id,
            size: 10,
            page,
            query: jobTitle && inputText.current,
            job_location_ids: location.id
        }, null).then((res)=>{
            setJobsData(res.data);
            setLoading(false);
            
        }).catch(e=>{
            setLoading(false)
        })
    },
    500
    ),[]);
    return <div className={style.search_container}>
        <div className={style.search_input_layout}>
            <div className={style.location_selector_wapper}>
                <Autocomplete
                    id='location-autocomplete'
                    options={formattedLocationList}
                    groupBy={(option: any) => option.region_display_name}
                    getOptionLabel={(option: any) => option.value || ''}
                    size='small'
                    onChange={(e,value)=>{
                        setLocation(value);
                        searchFunc(inputText.current, value, 1);             
                    }}
                    disableClearable={false}
                    // className={className}
                    renderInput={(params) => (
                        <label htmlFor={"location-autocomplete"} ref={params.InputProps.ref} className={style.location_input_wrapper}>
                            <input {...params.inputProps} placeholder='select location' className={style.location_input}/>
                            <div className={style.location_arrow}></div>
                            <div className={style.location_input_border}/>
                        </label>
                    )}
                // defaultValue={defaultValue}
                // {...rest}
                />
 
            </div>
            <label htmlFor='input-search' className={style.job_search_container}>
                <img className={style.job_prefix} src={require('./search.svg').default.src} />
                <input id={'input-search'} name={'input-search'} className={style.job_search_input}
                        onChange={(e)=>{
                            inputText.current = e.target.value;
                            searchFunc(e.target.value,location)
                        }}
                />
            </label>
        </div>
        <div style={{height: 20}}></div>
        {/* <div className={style.filter_layout}>
            <div className={style.filter_tag}>
                test
            </div>
            <div className={style.filter_tag}>
                test
            </div>
            <div className={style.filter_tag}>
                test
            </div>
            <div className={style.filter_tag}>
                test
            </div>
            <div className={style.filter_tag}>
                test
            </div>
        </div> */}
        {!!jobsData.jobs.length ? 
        <div className={style.content_layout}>
            {jobsData.jobs.map((item)=>{
                 return <JobsSearchCard key={item.job_title} {...item}/>
            })}
        </div> : 
        <div className={style.noData}>
            No Data
        </div>}
        <div className={style.pagination}>
            {!!jobsData.total_pages && 
                <Pagination 
                    page={jobsData.page}
                    count={jobsData.total_pages}
                    onChange={(e,v)=>{
                        searchFunc(null,location,v);
                    }}
                    shape="rounded" 
                    color={'primary'} 
                />
            }
        </div>

    </div>
}


const JobsSearchCard = (props: JobData) => {
    const {lang} = useCompanyDetail();
    return <div className={style.search_card}>
        <div className={style.title}>{props.job_title}</div>
        <div className={style.content}>
            <JobsTag {...props}/>
            <div className={style.salary}>
                {props.local_salary_range_value}
            </div>
        </div>
        <div className={style.footer}>
            <div className={style.chat_footer}>
                <div className={style.avatar}>
                    <Image height={24} width={24} src={props.recruiter_avatar} alt="img" />
                    <div className={style.status} style={{backgroundColor: props.recruiter_is_online ? '#0ebd5c': '#E5E6EB'}}/>
                </div>
                <div className={style.name}>
                    {props.recruiter_full_name} &nbsp;<div style={{position: 'relative', top: -2}}>.</div>&nbsp; {props.recruiter_job_title}
                    <Link className={style.chat_now} href={'/'+lang+props.job_url} target='_blank'>
                        Chat Now
                    </Link>
                </div>
            </div>
            <div className={style.location}>
                {props.job_location}
            </div>
        </div>
    </div>
}

interface TagProps extends JobData {
    count?: number
}

export const JobsTag = (props: TagProps) => {
    const tagsData = [
        {name:'', field: 'xp_lvl'},
        {name:'', field: 'degree'},
        {name:'', field: 'job_type'},
    ]
    return <div className={style.tags}>
        {tagsData.map(item=>{
            const value = props[item.field]
            if(!value) return null;
            return <div className={style.tag_item} key={value}>
                {value}
            </div>
        }).slice(0, props.count ?? 3)}
    </div>
}
export default SearchPanel;