import React, { useCallback, useRef, useState } from 'react';
import style from './index.module.scss'
import { Country, JobClasses, JobData, fetchJobsListReq, getIDFromKeyword } from '../../service';
import Autocomplete from '@mui/material/Autocomplete';
import { flat } from 'helpers/formatter'
import Pagination from '@mui/material/Pagination';
import { useCompanyDetail } from '../../DataProvider';
import { debounce } from 'lodash-es'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Loading from "app/components/loading";
import className from 'classnames';

interface Props  {
    list: Country[]
    functions: JobClasses[]

}


const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
const SearchPanel = (props:Props) =>{
    const formattedLocationList = flat(formatLocationConfig(props.list));
    const params = useParams();
    const {jobsRes} = useCompanyDetail();
    const [jobsData, setJobsData] = useState(jobsRes);
    const [location, setLocation] = useState<Country | undefined>();
    const inputText = useRef('');
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<JobClasses | undefined>();
    console.log('props',props);
    const id = getIDFromKeyword(params.keyword as any);
    // const searchFunc = useCallback(debounce((jobTitle, location, page = 1)=>{
        
    //     setLoading(true);
    //     console.log('jobTitle, location',jobTitle, location);
    //     fetchJobsListReq({
    //         companyIds: id,
    //         size: 10,
    //         page,
    //         query: jobTitle && inputText.current,
    //         job_location_ids: location.id
    //     }, null).then((res)=>{
    //         setJobsData(res.data);
    //         setLoading(false);
            
    //     }).catch(e=>{
    //         setLoading(false)
    //     })
    // },
    // 300
    // ),[]);
    const searchFunc = (jobTitle? : string , location? : Country, page = 1 , job_function_ids?: any ) => {
        setLoading(true);
        fetchJobsListReq({
            companyIds: id,
            size: 10,
            page,
            query: jobTitle && inputText.current,
            location: location?.id,
            jobFunctions: String(job_function_ids) || classes?.id,
        }, null).then((res)=>{
            console.log('then');
            setJobsData(res.data);
            setLoading(false);
            
        }).catch(e=>{
            console.log('catch');
            setLoading(false)
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchFunc(null, location);
        }
      };
    return <div className={style.search_container}>
        <div className={style.search_input_wrapper}>
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
                                <input {...params.inputProps} placeholder='location' className={style.location_input}/>
                                <div className={style.location_arrow}></div>
                                <div className={style.location_input_border}/>
                            </label>
                        )}
                    // defaultValue={defaultValue}
                    // {...rest}
                    />
    
                </div>
                <label htmlFor='input-search' className={style.job_search_container}>
                    <img className={style.job_prefix} src={require('./search.svg').default.src} alt='_' />
                    <input id={'input-search'} name={'input-search'} className={style.job_search_input}
                            onChange={(e)=>{
                                inputText.current = e.target.value;
                                searchFunc(e.target.value,location)
                            }}
                            onKeyDown={handleKeyPress}
                    />
                </label>
            </div>
            <div className={className({
                [style.search_button]: true,
                [style.button_loading] : loading
            })} onClick={()=>{
                if(!loading)return;
                searchFunc()
            }}>
                <span>
                    Find Now
                </span>
            </div>
        </div>

        <div className={style.filter_layout}>
            <div className={className({
                [style.filter_tag]: true,
                [style.active]: !classes
            })}
                onClick={()=>setClasses(undefined)}
            >
                All
            </div>
            {props.functions?.map((item,index)=>{
                return <div className={className({
                    [style.filter_tag]: true,
                    [style.active]: item.id === classes?.id
                })} key={index} onClick={()=>{
                    searchFunc(null,location,1,item.id)
                    setClasses(item)
                }}>
                    {item.value}
                </div>
            })}
        </div>
        <div className={style.filter_split}></div>
        {!!jobsData.jobs.length ? 
        <div className={style.content_layout}>
            {jobsData.jobs.map((item)=>{
                 return <JobsSearchCard key={item.job_title} {...item}/>
            })}
            {
                loading && <>
                    <div className={style.loading_wrapper}/>
                    <Loading/>
                </>
            }
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
        <div className={style.title}>
            <span>{props.job_title}</span>
        </div>
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