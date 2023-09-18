import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { languageContext } from 'app/components/providers/languageProvider';
import Empty from 'app/components/empty/empty';
import TextField from '@mui/material/TextField';



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
    const currentLocation = useRef<Country>();
    useEffect(() => {
        if (!props.functions) return;
        // filterTagView.current = [{}].concat(props.functions);
    }, [props.functions]);

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
        if (job_function_ids === 'all') {
            delete reqData.jobFunctions;
        }
        fetchJobsListReq(reqData, null).then((res) => {
            setJobsData(res.data);
            setLoading(false);

        }).catch(() => {
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
            setOffset((_) => offsetWidth + _);
        } catch (e) {
            console.log('list of filter tag is end');
        }

    }


    const AutocompleteComponent = useMemo(() => {
        return <Autocomplete
            id='location-autocomplete1'
            options={formattedLocationList}
            groupBy={(option: any) => option.region_display_name}
            getOptionLabel={(option: any) => {
                return option.value
            }}
            value={location}
            size='small'
            onChange={(e, value) => {
                currentLocation.current = value;
                setLocation(value);
                searchFunc(inputText.current, value, 1);
            }}

            key={location?.id}
            // disablePortal
            disableClearable={false}
            // className={className}
            // disableCloseOnSelect
            renderInput={(params) => {
                return (
                    <label ref={params.InputProps.ref} htmlFor={"location-autocomplete"} className={style.location_input_wrapper}>
                        <input {...params.inputProps} placeholder='Location' className={style.location_input} />
                        <div className={style.location_arrow}></div>
                        <div className={style.location_input_border} />
                    </label>
                )
            }}
        // defaultValue={defaultValue}
        // {...rest}
        />
    }, [location])
    return <div className={style.search_container}>
        <div className={style.search_input_wrapper}>
            <div className={style.search_input_layout}>
                <div className={style.location_selector_wapper}>
                    {AutocompleteComponent}
                </div>
                <label htmlFor='input-search' className={style.job_search_container}>
                    <Image width={16} height={16} className={style.job_prefix} src={require('./search.svg').default.src} alt='_' />
                    <input
                        id={'input-search'} name={'input-search'}
                        placeholder={overview.SearchPlaceholder}
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
                    {isMobile ? overview.Find : overview['FindNow']}
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
                    >
                        <InView threshold={1}>
                            {({ ref, inView }) => {
                                if (!isMobile) {
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
                                        if (!inView) {
                                            previousFunction()
                                        }
                                    }}
                                >
                                    {overview.All}
                                </div>
                            }}

                        </InView>

                        {props.functions?.map((item, index) => {
                            return <InView threshold={1} key={item.id}>
                                {({ ref, inView }) => {
                                    if (!isMobile) {
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
                                            if (!inView) {
                                                const all = document.getElementsByClassName('search-filter-tag');
                                                const nextElement = all[index + 2];
                                                if (nextElement) {
                                                    if (nextElement.getAttribute('data-visible') === 'false') {
                                                        nextFunction()
                                                    } else {
                                                        previousFunction()
                                                    }
                                                } else {
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

                        !loading && jobsData.jobs.map((item, index) => {
                            return <JobsSearchCard  {...item} key={item.job_title + item.id + index} />
                        })
                        :
                        <div className={style.noData}>
                            <Empty lang={contextLang.search} description={null} />
                        </div>
                }
            </div>
            <div className={style.pagination}>
                {!!jobsData.total_pages && !loading &&
                    <Pagination
                        page={jobsData.page}
                        count={jobsData.total_pages}
                        onChange={(e, v) => {
                            if (isMobile) {
                                firstRef.current && firstRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                            }
                            searchFunc(null, location, v);
                            window.scroll({top:0, left:0, behavior: "smooth",})
                        }}
                        shape="rounded"
                        color={'primary'}
                    />
                }
            </div>
        </div>

    </div>
}

export const getLocation = (region_id: number, location_id: number) => {
    const { config } = useCompanyDetail();
    const location_list = config?.location_lists || [];
    const region = location_list.find(item => item.id === region_id)?.locations || [];
    const location = region.find((item) => item.id === location_id)?.value || '';
    return `${location}`;
}

const JobsSearchCard = (props: JobData) => {
    const { lang, config } = useCompanyDetail();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const contextLang = useContext(languageContext);
    const { overview, } = contextLang.companyDetail;
    const degree_list = config?.degrees || [];
    const xp_lvl_list = config?.xp_lvls || [];
    const job_type_list = config?.job_types || [];
    const _tagsData = [...tagsData];
    _tagsData[0].name = xp_lvl_list.find(item => item.id === props.xp_lvl_id)?.value || '';
    _tagsData[1].name = degree_list.find(item => item.id === props.degree_id)?.value || '';
    _tagsData[2].name = job_type_list.find(item => item.id === props.job_type_id)?.value || '';
    return <div className={style.search_card}>
        <div className={style.search_title_layout}>
            <Link
                href={'/' + lang + props.job_url}
                target='_blank'
                title={props.job_title}
                className={style.title}>
                {props.is_urgent && <span className={style.urgentLabel}>Urgent</span>}<span>{props.job_title}</span>
            </Link>
            {<div className={style.jobcard_salary_wrapper}>
                <div className={style.salary}>
                    {props.local_salary_range_value}
                </div>
                <Link className={style.chat_now} href={'/' + lang + props.job_url} target='_blank'>
                    {overview.jobs.card.chatNow}
                </Link>
            </div>}
        </div>
        {/* {isMobile && <div className={style.salary}>
            {props.local_salary_range_value}
        </div>} */}
        <div className={style.content}>
            {_tagsData.map((item, index) => {
                const value = props[item.field]
                if (!value) return null;
                return <span className={style.mobile_tag} key={index}>
                    {item.name}
                </span>
            }).slice(0, 3)}
            {!isMobile && <JobsTag {...props} />}
        </div>
        <div className={style.footer}>
            <div className={style.chat_footer}>
                <div className={style.avatar}>
                    <Image fill src={props.recruiter_avatar} alt="img" />
                    <div className={style.status} style={{ backgroundColor: props.recruiter_is_online ? '#0ebd5c' : '#E5E6EB' }} />
                </div>
                <Link className={style.name} href={'/' + lang + props.job_url} target='_blank' >
                    <span title={props.recruiter_full_name}>
                        {props.recruiter_full_name}
                    </span>
                    {
                        props.recruiter_job_title &&
                        <>
                            &nbsp;<div style={{ position: 'relative', top: -2 }}>.</div>&nbsp;
                            <span title={props.recruiter_job_title}>{props.recruiter_job_title}</span>
                        </>
                    }

                </Link>
            </div>
            <div className={style.location}>
                {getLocation(props.job_region_id, props.job_location_id)}
            </div>
        </div>
    </div>
}

interface TagProps extends JobData {
    count?: number
    classNames?: any
    type?: 'background'
    style?: React.CSSProperties
}

export const tagsData = [
    { name: '', field: 'xp_lvl_id' },
    { name: '', field: 'degree_id' },
    { name: '', field: 'job_type_id' },
]
export const JobsTag = (props: TagProps) => {
    const { config } = useCompanyDetail();
    const degree_list = config?.degrees || [];
    const xp_lvl_list = config?.xp_lvls || [];
    const job_type_list = config?.job_types || [];
    const _tagsData = [...tagsData];
    _tagsData[0].name = xp_lvl_list.find(item => item.id === props.xp_lvl_id)?.value || '';
    _tagsData[1].name = degree_list.find(item => item.id === props.degree_id)?.value || '';
    _tagsData[2].name = job_type_list.find(item => item.id === props.job_type_id)?.value || '';
    return <div className={style.tags} style={props.style ? props.style : null}>
        {_tagsData.map((item, index) => {
            const value = props[item.field]
            if (!value || !item.name) return null;
            return <div className={style.tag_item + ' ' + ' tag_flag'} key={index}>
                {item.name}
            </div>
        }).slice(0, props.count ?? 3)}
    </div>
}

export default SearchPanel;