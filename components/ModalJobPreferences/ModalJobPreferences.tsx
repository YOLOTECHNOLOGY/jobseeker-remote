import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Components */
import ModalDialog from 'components/ModalDialog'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextField from 'components/MaterialTextField'

/* Helpers */
import { getJobTypeList, getSalaryOptions, getNoticePeriodList } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'

/* Styles */
import styles from './ModalJobPreferences.module.scss'

type ModalJobPreferencesProps = {
    modalName: string
    showModal: boolean
    config: any
    userDetail: any
    handleModal: Function
}

const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
}

// const requiredLabel = (text: string) => {
//     return (
//         <>
//             <span>{text}</span>
//             <span>*</span>
//         </>
//     )
// }

// const errorText = (errorMessage: string) => {
//     return (
//         <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
//             {errorMessage}
//         </Text>
//     )
// }

const ModalJobPreferences = ({
    modalName,
    showModal,
    config,
    userDetail,
    handleModal
}: ModalJobPreferencesProps) => {
    // to add work setting
    const { location: workLocation, notice_period_id: userAvailability } = userDetail
    const { job_title, job_type } = userDetail.job_preference
    const dispatch = useDispatch()

    const [jobTitle, setJobTitle] = useState(job_title || '')
    const [jobType, setJobType] = useState(job_type || '')

    const [minSalary, setMinSalary] = useState(Number(userDetail?.job_preference?.salary_range_from) || null)
    const [maxSalary, setMaxSalary] = useState(null)
    const [maxSalaryOptions, setMaxSalaryOptions] = useState([])

    // const [workSetting, setWorkSetting] = useState(work_setting || '')
    const [availability, setAvailability] = useState(userAvailability || '')

    const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
    const updateProfileSuccess = useSelector((store: any) => store.users.updateUserProfile.response)

    const locationList = useSelector((store: any) => store.config.config.response?.inputs?.location_lists)
    const formattedLocationList = flat(formatLocationConfig(locationList))
    const [location, setLocation] = useState(formattedLocationList[0])

    const noticeList = getNoticePeriodList(config)
    const minSalaryOptions = getSalaryOptions(config)
    const jobTypeList = getJobTypeList(config)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        getMaxSalaryOptions(minSalary)
    }, [])

    useEffect(() => {
        getMaxSalaryOptions(minSalary)
    }, [minSalary])

    useEffect(() => {
        if (userDetail && userDetail.location) {
            if (userDetail.location) {
                const matchedLocation = formattedLocationList.find((loc) => {
                    return loc.value == workLocation
                })
                setLocation(matchedLocation)
                setValue('location', matchedLocation)
            }
        }

        if (userDetail && userDetail.job_preference.job_title) {
            setJobTitle(userDetail.job_preference.job_title)
            setValue('jobTitle', userDetail.job_preference.job_title)
        }

        if (userDetail && userDetail.job_preference.job_type) {
            setJobType(userDetail.job_preference.job_type)
            setValue('jobType', userDetail.job_preference.job_type)
        }

        if (userDetail && userDetail.job_preference.salary_range_from) {
            setMinSalary(Number(userDetail.job_preference.salary_range_from))
            setValue('minSalary', Number(userDetail.job_preference.salary_range_from))
        }

        if (userDetail && userDetail.job_preference.salary_range_to) {
            setMaxSalary(Number(userDetail.job_preference.salary_range_to))
            setValue('maxSalary', Number(userDetail.job_preference.salary_range_to))
        }
        if (userDetail && userDetail.notice_period_id) {
            setAvailability(userDetail.notice_period_id)
            setValue('noticePeriod', userDetail.notice_period_id)
        }
    }, [userDetail])

    const getMaxSalaryOptions = (minSalary) => {
        const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
        setMaxSalary(maxSalaryOptions.length > 0 ? maxSalaryOptions[0].value : null)
        setMaxSalaryOptions(maxSalaryOptions)
    }

    const onLocationSearch = (e, value) => {
        setLocation(value)
    }

    const onSubmit = (data) => {
        // to add workSetting
        const { jobTitle, jobType, minSalary, maxSalary, noticePeriod } = data
        const payload = {
            preferences: {
                job_title: jobTitle,
                job_type_key: jobType,
                location_key: (location as any).key || '',
                salary_range_from: Number(minSalary),
                salary_range_to: Number(maxSalary)
            },
            profile: {
                notice_period_id: noticePeriod
            }
        }

        dispatch(updateUserPreferencesRequest(payload))
    }

    useEffect(() => {
        handleCloseModal()
    }, [updateProfileSuccess])

    const handleCloseModal = () => {
        handleModal(modalName, false)
    }

    const modalJobPreferenceContent = (
            <div className={styles.jobPreferences}>
                <div className={styles.jobPreferencesForm}>
                    <div className={styles.jobPreferencesFormGroup}>
                        <MaterialTextField 
                            refs={{
                                ...register('jobTitle'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            name='jobTitle'
                            label='Desire job title'
                            variant='outlined'
                            value={jobTitle}
                            defaultValue={jobTitle}
                            autoComplete='off'
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.jobPreferencesFormGroup}>
                        <MaterialBasicSelect
                            fieldRef={{
                                ...register('jobType'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Desire job type'
                            value={jobType}
                            options={jobTypeList}
                            onChange={(e) => {
                                setJobType(e.target.value)
                            }}
                        />
                    </div>
                    <div className={styles.jobPreferencesFormGroup}>
                        <MaterialBasicSelect
                            fieldRef={{
                                ...register('minSalary'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Expected min. salary'
                            value={minSalary}
                            options={minSalaryOptions}
                            onChange={(e) => setMinSalary(e.target.value)}
                        />
                        <div style={{ width: '16px' }}></div>
                        <MaterialBasicSelect
                            fieldRef={{
                                ...register('maxSalary'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Max. salary'
                            value={maxSalary}
                            options={maxSalaryOptions}
                            onChange={(e) => setMaxSalary(e.target.value)}
                        />
                    </div>
                    <div className={styles.jobPreferencesFormGroup}>
                        <MaterialLocationField
                            fieldRef={{
                                ...register('location'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Desire working location'
                            value={location}
                            defaultValue={location}
                            onChange={onLocationSearch}
                        />
                    </div>
                    {/* <div className={styles.jobPreferencesFormGroup}>
                        <MaterialBasicSelect
                            fieldRef={{
                                ...register('workSetting'),
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Desire working setting'
                            value={workSetting}
                            // options={workSettingList}
                            onChange={(e) => {
                                setWorkSetting(e.target.value)
                            }}
                        />
                    </div> */}
                    <div className={styles.jobPreferencesFormGroup}>
                        <MaterialBasicSelect
                            fieldRef={{
                                ...register('noticePeriod')
                            }}
                            className={styles.jobPreferencesFormInput}
                            label='Availability'
                            value={availability}
                            options={noticeList}
                            onChange={(e) => setAvailability(e.target.value)}
                        />
                    </div>
                </div>
            </div>
    )

    return (
        <ModalDialog
            open={showModal}
            onClose={handleCloseModal}
            headerTitle='Job Preference'
            firstButtonText='Cancel'
            secondButtonText='Save'
            isSecondButtonLoading={isUpdatingUserProfile}
            firstButtonIsClose
            handleFirstButton={handleCloseModal}
            handleSecondButton={handleSubmit(onSubmit)}
            fullScreen
        >
            {modalJobPreferenceContent}
        </ModalDialog>
    )
}

export default ModalJobPreferences