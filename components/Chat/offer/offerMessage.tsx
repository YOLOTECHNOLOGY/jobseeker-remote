/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { Offerhead, Offermask } from 'images'
import Image from 'next/image'
import MaterialButton from 'components/MaterialButton'
const OfferMessage = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef } = props
    const actionsRef = useRef({} as any)
    const [data, setData] = useState<any>({})

    const context = {

        modalOfferMessage(actions) {
            actionsRef.current = actions
            setData(actions.data?.data)
            setShow(true)
        },

        closeOfferMessage() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    if (!show) {
        return null
    }
    return (<div className={styles.message_background}>
        <div className={styles.message}>
            <img
                className={styles.background}
                src={Offermask} alt={''}
            />
            <div className={styles.content}>
                <Image className={styles.company_logo} src={data?.company?.logo_url} width={56} height={56} alt='' />
                <div className={styles.company_name}>{data?.company_name ?? 'Company'}</div>
                <div className={styles.sender}>{`${data?.recruiter?.full_name ?? 'Boss'} send an offer`}</div>
                <MaterialButton
                    capitalize
                    className={styles.viewnow}
                    onClick={() => actionsRef.current?.view?.()}
                >
                    View now
                </MaterialButton>
                <MaterialButton
                    capitalize
                    className={styles.viewlater}
                    onClick={() => actionsRef.current?.close?.()}
                >
                    View later
                </MaterialButton>
            </div>
            <img
                className={styles.head}
                src={Offerhead} alt={''}
            />
            <div
                className={styles.closeIcon}
                onClick={() => actionsRef.current?.close?.()}
            >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.28833 7.67154L14.6329 2.47917C14.8677 2.25101 14.9997 1.94157 14.9997 1.61892C14.9997 1.29626 14.8677 0.986822 14.6329 0.75867C14.3981 0.530518 14.0795 0.402344 13.7474 0.402344C13.4153 0.402344 13.0968 0.530518 12.862 0.75867L7.5174 5.95104L2.17283 0.75867C2.05655 0.645701 1.9185 0.556089 1.76658 0.494951C1.61465 0.433812 1.45181 0.402344 1.28737 0.402344C1.12292 0.402344 0.960086 0.433812 0.808158 0.494951C0.65623 0.556089 0.518184 0.645701 0.401904 0.75867C0.285623 0.87164 0.193383 1.00575 0.130453 1.15336C0.0675221 1.30096 0.0351323 1.45916 0.0351323 1.61892C0.0351323 1.77868 0.0675221 1.93688 0.130453 2.08448C0.193383 2.23208 0.285623 2.3662 0.401904 2.47917L5.75021 7.67154L0.405643 12.8639C0.281265 12.9748 0.181242 13.1089 0.111586 13.2583C0.0419305 13.4076 0.00408087 13.5691 0.000312151 13.7331C-0.00345657 13.897 0.0269342 14.06 0.0896564 14.2122C0.152379 14.3645 0.246137 14.5028 0.365297 14.6189C0.484457 14.7351 0.626558 14.8266 0.783057 14.888C0.939556 14.9494 1.10722 14.9795 1.27598 14.9763C1.44473 14.9732 1.61109 14.9369 1.76505 14.8697C1.91901 14.8025 2.0574 14.7058 2.17189 14.5853L7.51647 9.39294L12.862 14.5853C12.9783 14.6983 13.1164 14.7879 13.2684 14.849C13.4204 14.9101 13.5833 14.9415 13.7478 14.9415C13.9123 14.9415 14.0751 14.9099 14.2271 14.8488C14.379 14.7876 14.5171 14.6979 14.6334 14.5849C14.7496 14.4718 14.8419 14.3377 14.9048 14.19C14.9677 14.0423 15 13.8841 15 13.7243C15 13.5645 14.9675 13.4063 14.9045 13.2586C14.8415 13.111 14.7492 12.9769 14.6329 12.8639L9.28833 7.67154Z" fill="white" />
                </svg>
            </div>
        </div>
    </div>)
}
export default OfferMessage