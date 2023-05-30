import React,{useState,useEffect} from "react"
import MaterialTextField from 'components/MaterialTextField'
import { useFirstRender } from 'helpers/useFirstRender'
import styles from '../../index.module.scss'
import errorText from '../errorText'

interface initProps{
    setEmail?:Function,
    email:string,
    setDisable?:Function
}

const EmailComponent =({setEmail,email,setDisable}:initProps)=>{
    const [emailError, setEmailError] = useState<string>('')
   
    const firstRender = useFirstRender()
  
    useEffect(() => {
     if (firstRender) {
       return
     }
     let errorText = null
     if (!email?.length || !/\S+@\S+\.\S+/.test(email)) {
       errorText = "Please enter a valid email address."
     }else{
        errorText = null
     }
     setEmailError(errorText)
   }, [email])
 
    useEffect(()=>{
        if (firstRender) {
            return
          }
    setDisable(!!emailError) 
      
    },[emailError])

return (
    <>
    <MaterialTextField
    className={styles.fullwidth}
    label={'Email address'}
    size='small'
    type='email'
    onChange={(e) => setEmail(e.target.value)}
    error={emailError ? true : false}
  />
    {emailError && errorText(emailError)}
    </>
)
    
}
export default EmailComponent