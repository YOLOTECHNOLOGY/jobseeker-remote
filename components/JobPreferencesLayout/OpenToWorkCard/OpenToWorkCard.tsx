import React, { useState } from 'react'

/* Components */
import Text from 'components/Text'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

/* Styles */
import styles from './OpenToWorkCard.module.scss'

/* Services */
import { toggleOpenToWorkService } from 'store/services/jobs/toggleOpenToWork'

import MaterialButton from '../../MaterialButton'

// import ModalJobPreferences from 'components/ModalJobPreferences/ModalJobPreferences'
import DynamicModalJobPreferences from 'components/DynamicModalJobPreferences'

type OpenToWorkCardProps = {
    title: string
}

const onClickTest = () => {
    return (
        <DynamicModalJobPreferences
            isShowModal={true}
        />
        // <ModalJobPreferences
        //     isShowModal={true}
        // />
    )
}

const OpenToWorkCard = ({
    title
}: OpenToWorkCardProps) => {
    const [openToWork, setOpenToWork] = useState(true)

    const handleVisibility = () => {
        setOpenToWork(!openToWork)
        toggleOpenToWorkService({
            is_visible: !openToWork
        })
    }

    return (
        <div className={styles.CardContainer}>
            <Text className={styles.CardContainerTitle} bold textStyle='xl' textColor='primaryBlue'>
                {title}
            </Text>
            <FormControlLabel
                control={
                <Switch 
                    checked={openToWork}
                    onChange={handleVisibility}
                />
                }
                label={
                <Text textStyle='lg'>
                Let recruiters know that you are open to work
                </Text>
                }
            />
        </div>
    )
}

export default OpenToWorkCard