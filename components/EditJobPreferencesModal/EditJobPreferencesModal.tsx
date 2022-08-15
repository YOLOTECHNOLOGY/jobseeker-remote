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
import styles from './EditJobPreferencesModal.module.scss'

type EditJobPreferencesModalProps = {
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
//   return (
//     <>
//       <span>{text}</span>
//       <span className={styles.requiredField}>*</span>
//     </>
//   )
// }

// const errorText = (errorMessage: string) => {
//   return (
//     <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
//       {errorMessage}
//     </Text>
//   )
// }

const EditJobPreferencesModal = ({
	modalName,
	showModal,
	config,
	userDetail,
	handleModal
}: EditJobPreferencesModalProps) => {
	// to add work setting
	const preferredJobTitle = userDetail?.job_preference?.job_title
	const preferredJobType = userDetail?.job_preference?.job_type
	const preferredMinSalary = userDetail?.job_preference?.salary_range_from
	const preferredMaxSalary = userDetail?.job_preference?.salary_range_to
	const workLocation = userDetail?.job_preference?.location
	const preferredAvailability = userDetail?.notice_period_id

	const dispatch = useDispatch()

	const [jobType, setJobType] = useState(preferredJobTitle || null)

	const [minSalary, setMinSalary] = useState(Number(preferredMinSalary) || null)
	const [maxSalary, setMaxSalary] = useState(Number(preferredMaxSalary) || null)
	const [maxSalaryOptions, setMaxSalaryOptions] = useState([])

	// const [workSetting, setWorkSetting] = useState(work_setting || '')
	const [availability, setAvailability] = useState(preferredAvailability || null)

	const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)

	const locationList = useSelector((store: any) => store.config.config.response?.inputs?.location_lists)
	const formattedLocationList = flat(formatLocationConfig(locationList))
	const [location, setLocation] = useState(formattedLocationList[0])

	const jobTypeList = getJobTypeList(config)

	const noticeList = getNoticePeriodList(config)
	const minSalaryOptions = getSalaryOptions(config)

	const matchedJobType = jobTypeList.find((type) => {
		return type.label == preferredJobType
	})

	const {
		register,
		handleSubmit,
		// formState: { errors },
		setValue,
		reset
	} = useForm({
		defaultValues: {
			jobTitle: preferredJobTitle,
			jobType: matchedJobType?.key,
			minSalary: Number(preferredMinSalary),
			maxSalary: Number(preferredMaxSalary),
			location: workLocation,
			noticePeriod: preferredAvailability
		}
	})

	useEffect(() => {
		getMaxSalaryOptions(minSalary)
	}, [])

	useEffect(() => {
		getMaxSalaryOptions(minSalary)
	}, [minSalary])

	useEffect(() => {
		if (userDetail && userDetail?.job_preference?.location) {
			if (userDetail?.job_preference?.location) {
				const matchedLocation = formattedLocationList.find((loc) => {
					return loc.value == workLocation
				})
				setLocation(matchedLocation)
				setValue('location', matchedLocation?.key)
			}
		}

		if (userDetail && preferredJobType) {
			const getJobType = jobTypeList.find((type) => {
				return type.label == preferredJobType
			})
			setJobType(getJobType?.key)
			setValue('jobType', getJobType?.key)
		}

		if (userDetail && preferredMinSalary) {
			setMinSalary(Number(userDetail.job_preference.salary_range_from))
			setValue('minSalary', userDetail.job_preference.salary_range_from)
		}

		if (userDetail && preferredMaxSalary) {
			setMaxSalary(Number(userDetail.job_preference.salary_range_to))
			setValue('maxSalary', userDetail.job_preference.salary_range_to)
		}

		if (userDetail && preferredAvailability) {
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
		console.log('data', data)
		const { jobTitle, jobType, minSalary, maxSalary, location, noticePeriod } = data // jobType is a key
		const matchedLocation = formattedLocationList.find((loc) => {
			return loc.value == location
		})

		const payload = {
				preferences: {
						job_title: jobTitle || '',
						job_type_key: jobType || '',
						location_key: matchedLocation?.key || '',
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
	}, [userDetail])

	const handleCloseModal = () => {
		handleModal(modalName, false)
		reset()
	}

	const modalJobPreferenceContent = (
		<div className={styles.jobPreferences}>
			<div className={styles.jobPreferencesForm}>
				<div className={styles.jobPreferencesFormGroup}>
					<MaterialTextField 
							refs={{
								...register('jobTitle')
							}}
							className={styles.jobPreferencesFormInput}
							name='jobTitle'
							label='Desire job title'
							variant='outlined'
							autoComplete='off'
					/>
				</div>
				<div className={styles.jobPreferencesFormGroup}>
						<MaterialBasicSelect
								fieldRef={{
									...register('jobType')
								}}
								className={styles.jobPreferencesFormInput}
								label='Desire job type'
								value={jobType}
								defaultValue={jobType}
								options={jobTypeList}
								onChange={(e) => setJobType(e.target.value)}
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
							defaultValue={minSalary}
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
							defaultValue={maxSalary}
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
									...register('noticePeriod'),
								}}
								className={styles.jobPreferencesFormInput}
								label='Availability'
								value={availability}
								defaultValue={availability}
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

export default EditJobPreferencesModal