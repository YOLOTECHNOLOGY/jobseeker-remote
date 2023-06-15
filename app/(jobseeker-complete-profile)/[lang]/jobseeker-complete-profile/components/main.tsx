"use client"
import React,{useEffect,useState,useContext} from "react";
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import BasicInformation from './basicInformation'
import WorkExperience from "./workExperience";
import EducationExperience from "./educationExperience";
import DesiredJob from "./desiredJob";
import { useSelector } from 'react-redux'
import { getCookie } from 'helpers/cookies'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { useDispatch } from 'react-redux'
import Header from './header'
import { LinkContext } from 'app/[lang]/components/providers/linkProvider'
import { getLang } from 'helpers/country'
const Main = (props:any)=>{
   const accessToken = getCookie('accessToken')
   const { push } = useContext(LinkContext)
   const langKey = getLang()
   if(!accessToken){
     push(`/${langKey}/get-started?`)
   }
    const searchParams = useSearchParams()
    const search = searchParams.get('step')
    const getUserInfo = ()=>{
      dispatch(fetchUserOwnDetailRequest({ accessToken }))
    }
    const [newProps,setNewProps] = useState<any>({...props,getUserInfo})
    const [step, setStep] = useState(1)
    const userDetail = useSelector((store: any) => store?.users.fetchUserOwnDetail.response)
 
    const dispatch = useDispatch()
  
    useEffect(() => {
      const hasStep = [1, 2, 3, 4, 5, 6,7].includes(+search)
      if (search && hasStep) {
        setStep(Number(search))
      }
    }, [search])
    
    useEffect(()=>{
      setNewProps({
        ...props,
        userDetail,
        getUserInfo
      })
    },[JSON.stringify(userDetail)])

  

    // const newProps = {...props,userDetail,getUserInfo}

   return <div className={styles.profile}>
     <Header lang={props.lang} step={step}/>
       {
        step === 1 && <BasicInformation {...newProps}/>
       }
       {
        step === 2 && <WorkExperience {...newProps}/>
       }
       {
        step === 3 && <EducationExperience {...newProps}/>
       }
       {
        step === 4 && <DesiredJob {...newProps}/>
       }

   </div> 
}

export default Main