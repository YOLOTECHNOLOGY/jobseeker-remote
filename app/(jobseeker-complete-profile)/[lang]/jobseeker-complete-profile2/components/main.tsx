"use client"
import React,{useEffect,useState} from "react";
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import BasicInformation from './basicInformation'

const Main = (props:any)=>{

    const searchParams = useSearchParams()
    const search = searchParams.get('step')
    const [step, setStep] = useState(1)
  
    useEffect(() => {
      const hasStep = [1, 2, 3, 4, 5, 6,7].includes(+search)
      if (search && hasStep) {
        setStep(Number(search))
      } else {
        setStep(1)
      }
    }, [search])
   return <div className={styles.main}>
       {
        step === 1 && <BasicInformation {...props}/>
       }
      


   </div> 
}

export default Main