import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import style from './index.module.scss'
import { Country, JobClasses, JobData, fetchJobsListReq, getIDFromKeyword } from '../../service';
import Autocomplete from '@mui/material/Autocomplete';
import { flat } from 'helpers/formatter'
import Pagination from '@mui/material/Pagination';
import { useCompanyDetail } from '../../DataProvider';
import { findLastIndex } from 'lodash-es'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Loading from "app/components/loading";
import className from 'classnames';
import { InView } from "react-intersection-observer";
import useMediaQuery  from '@mui/material/useMediaQuery';
import { languageContext } from 'app/components/providers/languageProvider';



interface Props {
    CountryList: Country[]
    functions: JobClasses[]

}

interface JobVisible extends Partial<JobClasses> {
    visible?: boolean
}

const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
}
const filterTagView = {
    current: []
};

const SearchPanel = (props: Props) => {
    const formattedLocationList = flat(formatLocationConfig(props.CountryList));
    const params = useParams();
    const { jobs } = useCompanyDetail();
    const [jobsData, setJobsData] = useState(jobs);
    const [location, setLocation] = useState<Country | undefined>();
    const inputText = useRef('');
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<JobClasses | undefined>();
    const id = getIDFromKeyword(params.keyword as any);
    const [offset, setOffset] = useState(0);
    const [leftShow, setLeftShow] = useState(false);
    const [rightShow, setRightShow] = useState(true);
    // const filterTagView = useRef<JobVisible[]>([{}].concat(props.functions));
    const firstRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery('(max-width:768px)');
    const contextLang = useContext(languageContext);
	const { overview } = contextLang.companyDetail;
    useEffect(() => {
        if (!props.functions) return;
        // filterTagView.current = [{}].concat(props.functions);
    }, [props.functions]);
    // const searchFunc = useCallback(debounce((jobTitle, location, page = 1)=>{
    //     setLoading(true);
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
    // useEffect(()=>{
    //     const all = document.getElementsByClassName('search-filter-tag');
    //     console.log("all.index",all.length);
    //     try {
    //         const previousindex = [...all].findIndex(item => item.getAttribute('data-visible') === 'true');
    //         const index = <findLastIn></findLastIn>dex([...all], (item, index) => {
    //             return item.getAttribute('data-visible') === 'true'
    //         });
    //         // if(previousindex < 2){
    //         //     setLeftShow(false);
    //         // }else{
    //         //     setLeftShow(true);
    //         // }
    //         // if(index > all.length - 3){
    //         //     setRightShow(false)
    //         // }else{
    //         //     setRightShow(true)
    //         // }
    //         console.log('previousindex',previousindex);
    //         console.log('index',index);

    //     } catch (e) {
    //         console.log('list of filter tag is end');
    //     }

    // },[offset, props.functions]);
    const searchFunc = (jobTitle?: string, location?: Country, page = 1, job_function_ids?: any) => {
        setLoading(true);
        const reqData = {
            companyIds: id,
            size: 10,
            page,
            query: jobTitle || inputText.current,
            location: location?.id,
            jobFunctions: job_function_ids ? String(job_function_ids) : classes?.id,
        }
        console.log('reqData', reqData);
        if (job_function_ids === 'all') {
            delete reqData.jobFunctions;
        }
        fetchJobsListReq(reqData, null).then((res) => {
            setJobsData(res.data);
            setLoading(false);

        }).catch(e => {
            console.log('catch');
            setLoading(false)
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchFunc(null, location);
        }
    };
    const previousFunction = () => {
        const all = document.getElementsByClassName('search-filter-tag');
        const previousindex = [...all].findIndex(item => item.getAttribute('data-visible') === 'true');
        try {
            // @ts-ignore
            const { offsetWidth } = all[previousindex - 1];
            setOffset((_) => _ - offsetWidth);
        } catch (e) {
            console.log('list of filter tag is end');
        }

        // const index = array.reverse().findIndex(item => item.visible);

    }
    const nextFunction = () => {
        const all = document.getElementsByClassName('search-filter-tag');
        const index = findLastIndex([...all], (item, index) => {
            return item.getAttribute('data-visible') === 'true'
        });

        try {
            // @ts-ignore
            const { offsetWidth } = all[index + 1];
            // console.log(_offset);
            setOffset((_) => offsetWidth + _);
        } catch (e) {
            console.log('list of filter tag is end');
        }

    }
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
                        onChange={(e, value) => {
                            setLocation(value);
                            searchFunc(inputText.current, value, 1);
                        }}
                        disableClearable={false}
                        // className={className}
                        renderInput={(params) => {
                            return (
                                <label htmlFor={"location-autocomplete"} ref={params.InputProps.ref} className={style.location_input_wrapper}>
                                    <input {...params.inputProps} placeholder='Location' className={style.location_input} />
                                    <div className={style.location_arrow}></div>
                                    <div className={style.location_input_border} />
                                </label>
                            )
                        }}
                    // defaultValue={defaultValue}
                    // {...rest}
                    />

                </div>
                <label htmlFor='input-search' className={style.job_search_container}>
                    <Image width={16} height={16} className={style.job_prefix} src={require('./search.svg').default.src} alt='_' />
                    <input 
                        id={'input-search'} name={'input-search'} 
                        placeholder='Job title or company'
                        className={style.job_search_input}
                        onChange={(e) => {
                            inputText.current = e.target.value;
                            // searchFunc(e.target.value,location)
                        }}
                        onKeyDown={handleKeyPress}
                    />
                </label>
            </div>
            <div className={className({
                [style.search_button]: true,
                [style.button_loading]: loading
            })} onClick={() => {
                if (loading) return;
                searchFunc()
            }}>
                <span>
                    {
                        isMobile ? overview.Find : overview['FindNow']
                    }
                </span>
            </div>
        </div>
        {
            !!props.functions.length &&
            <div className={style.filter_container}>
                <div
                    className={className({
                        [style.arrow_left]: true,
                        [style.opacity]: !leftShow
                    })}
                    onClick={previousFunction}></div>
                <div className={style.filter_layout}>
                    <div className={style.filter_wrapper}
                        style={{
                            transform: !isMobile ? `translate3d(${-offset}px, 0px, 0px)` : 'none'
                        }}
                        // onTouchStart={handleTouchStart}
                        // onTouchMove={handleTouchMove}
                        // onTouchEnd={handleTouchEnd}
                    >
                        <InView threshold={1}>
                            {({ ref, inView }) => {
                                if(!isMobile){
                                    if (inView) {
                                        setLeftShow(false)
                                    } else {
                                        setLeftShow(true)
                                    }
                                }

                                return <div className={className({
                                    ['search-filter-tag']: true,
                                    [style.filter_tag]: true,
                                    [style.active]: !classes
                                })}
                                    data-visible={inView}
                                    ref={ref}
                                    onClick={() => {
                                        searchFunc(null, location, 1, 'all');
                                        setClasses(undefined);
                                        if(!inView){
                                            previousFunction()
                                         }
                                    }}
                                >
                                    {overview.All}
                                </div>
                            }}

                        </InView>

                        {props.functions?.map((item, index) => {
                            return <InView threshold={1} key={index}>
                                {({ ref, inView }) => {
                                    if(!isMobile){
                                        if (inView && props.functions.length - 1 === index) {
                                            setRightShow(false)
                                        } else {
                                            setRightShow(true)
                                        }
                                    }
                                    return <div
                                        ref={ref}
                                        data-visible={inView}
                                        className={className({
                                            ['search-filter-tag']: true,
                                            [style.filter_tag]: true,
                                            [style.active]: item.id === classes?.id
                                        })}
                                        onClick={() => {
                                            searchFunc(null, location, 1, item.id)
                                            setClasses(item)
                                            if(!inView){
                                               const all = document.getElementsByClassName('search-filter-tag');
                                               const nextElement  = all[index+2];
                                               if(nextElement){
                                                    if(nextElement.getAttribute('data-visible') === 'false'){
                                                        nextFunction()
                                                    }else{
                                                        previousFunction()
                                                    }
                                               }else{
                                                 nextFunction()
                                               }
                                            }
                                        }}>
                                        {/* {inView ? '1' : '2'} */}
                                        {item.value}
                                    </div>
                                }}
                            </InView>

                        })}
                    </div>
                </div>


                <div
                    className={className({
                        [style.arrow_right]: true,
                        [style.opacity]: !rightShow
                    })}
                    onClick={nextFunction}
                ></div>
            </div>
        }
        <div className={style.search_content_wrapper}>
        <div className={style.filter_split} ref={firstRef}></div>
        <div className={style.content_layout}>
            {loading ?
                loading && <div className={style.loading_wrapper}>
                    {/* <div className={style.loading_wrapper}/> */}
                    <Loading />
                </div>
                : !!jobsData.jobs.length ?

                    !loading && jobsData.jobs.map((item) => {
                        return <JobsSearchCard key={item.job_title} {...item} />
                    })
                    :
                    <div className={style.noData}>
                        No Data
                    </div>
            }
        </div>
        <div className={style.pagination}>
            {!!jobsData.total_pages && !loading &&
                <Pagination
                    page={jobsData.page}
                    count={jobsData.total_pages}
                    onChange={(e, v) => {
                        if(isMobile){
                            firstRef.current && firstRef.current?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                        }
                        searchFunc(null, location, v);
                    }}
                    shape="rounded"
                    color={'primary'}
                />
            }
        </div>
        </div>

    </div>
}


const JobsSearchCard = (props: JobData) => {
    const { lang } = useCompanyDetail();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const contextLang = useContext(languageContext);
	const { overview } = contextLang.companyDetail;
    return <div className={style.search_card}>
        <div className={style.search_title_layout}>
            <Link
                href={'/' + lang + props.job_url}
                target='_blank'
                title={props.job_title}
                className={style.title}>
                <span>{props.job_title}</span>
            </Link>
            <div className={style.jobcard_salary_wrapper}>
                <div className={style.salary}>
                    {props.local_salary_range_value}
                </div>
                <Link className={style.chat_now} href={'/' + lang + props.job_url} target='_blank'>
                        {overview.jobs.card.chatNow}
                </Link>
            </div>
        </div>

        <div className={style.content}>
            {tagsData.map(item => {
                const value = props[item.field]
                if (!value) return null;
                return <span className={style.mobile_tag} key={value}>
                    {value}
                </span>
            }).slice(0,3)}
            {!isMobile && <JobsTag {...props} />}
        </div>
        <div className={style.footer}>
            <div className={style.chat_footer}>
                <div className={style.avatar}>
                    <Image fill src={props.recruiter_avatar} alt="img" />
                    <div className={style.status} style={{ backgroundColor: props.recruiter_is_online ? '#0ebd5c' : '#E5E6EB' }} />
                </div>
                <Link className={style.name}  href={'/' + lang + props.job_url} target='_blank' >
                    <span title={props.recruiter_full_name}>
                        {props.recruiter_full_name}
                    </span>
                    &nbsp;<div style={{ position: 'relative', top: -2 }}>.</div>&nbsp;
                    <span title={props.recruiter_job_title}>{props.recruiter_job_title}</span>

                </Link>
            </div>
            <div className={style.location}>
                {props.job_location}
            </div>
        </div>
    </div>
}

interface TagProps extends JobData {
    count?: number
    classNames?: any
    type?: 'background'
}

export const tagsData = [
    { name: '', field: 'xp_lvl' },
    { name: '', field: 'degree' },
    { name: '', field: 'job_type' },
]
export const JobsTag = (props: TagProps) => {

    return <div className={style.tags}>
        {tagsData.map(item => {
            const value = props[item.field]
            if (!value) return null;
            return <div className={style.tag_item + ' ' + ' tag_flag'} key={value}>
                {value}
            </div>
        }).slice(0, props.count ?? 3)}
    </div>
}

export default SearchPanel;