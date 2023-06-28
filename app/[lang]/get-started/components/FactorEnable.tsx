import React, { useEffect,useRef } from 'react'
import styles from '../index.module.scss'
import useGetStarted from '../hooks/useGetStarted'
import lottie from "lottie-web";
function FactorEnable(props: any) {
 // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const { newGetStarted } = props.lang
  const { defaultLoginCallBack ,userInfo} = useGetStarted()
  const container= useRef(null);
  console.log({ userInfo })
  useEffect(() => {
    setTimeout(() => {
      defaultLoginCallBack(userInfo)
    }, 3000)
  }, [])

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: require("images/loginSafe.json")
    });

    lottie.play()
    return () => {
      lottie.destroy();
    };
  }, []);


  return (
    <div className={styles.enabled}>
       <div  ref={container} className={styles.imgContainer}></div>
      <h2>
        {newGetStarted.enableTwoFactor} <br />
        {newGetStarted.authenticationEnabled} ✅
      </h2>
      <p className={styles.notice}>{newGetStarted.factorTip}</p>
    </div>
  )
}

export default FactorEnable
