import React, { useState } from 'react'

/* Components */
import Text from 'components/Text'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

/* Styles */
import styles from './OpenToWorkCard.module.scss'

/* Services */
import { toggleOpenToWorkService } from 'store/services/jobs/toggleOpenToWork'

type OpenToWorkCardProps = {
    title: string
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
        <div className={styles.OpenToWorkCard}>
            <Text className={styles.OpenToWorkCardTitle} bold textStyle='xl' textColor='primaryBlue'>
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