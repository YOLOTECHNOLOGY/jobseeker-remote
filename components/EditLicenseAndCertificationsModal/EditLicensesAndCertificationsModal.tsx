import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import classNames from 'classnames/bind'

/* Components */
import Text from 'components/Text'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import ModalDialog from 'components/ModalDialog'
import MaterialDatePicker from 'components/MaterialDatePicker'
import MaterialTextField from 'components/MaterialTextField'

/* Actions */
import { manageUserLicensesAndCertificationsRequest } from 'store/actions/users/manageUserLicensesAndCertifications'

/* Helpers */
import { urlValidation } from 'helpers/formValidation'

/* Styles */
import styles from './EditLicensesAndCertificationsModal.module.scss'

type EditLicensesAndCertificationsModalProps = {
	modalName: string
	showModal: boolean
	licenseData: any
	handleModal: Function
}

const EditLicensesAndCertificationsModal = ({
	modalName,
	showModal,
	licenseData,
	handleModal
}: EditLicensesAndCertificationsModalProps) => {
	
	const dispatch = useDispatch()

	const [licenseCertificationTitle, setLicenseCertificationTitle] = useState(null)
	const [issuingOrganisation, setIssuingOrganisation] = useState(null)
	const [isLicenseCertificationPermanent, setIsLicenseCertificationPermanent] = useState(false)
	const [issueDate, setIssueDate] = useState(null)
	const [expiryDate, setExpiryDate] = useState(null)
	const [credentialId, setCredentialId] = useState(null)
	const [credentialUrl, setCredentialUrl] = useState(null)

	const [hasErrorOnExpiryDate, setHasErrorOnExpiryDate] = useState(false)
	const [hasValidationError, setHasValidationError] = useState(true)

	const isUpdating = useSelector((store: any) => store.users.manageUserLicensesAndCertifications.fetching)
	const updateLicensesAndCertificationsSuccess = useSelector(
		(store: any) => store.users.manageUserLicensesAndCertifications.response
	)

	const requiredLabel = (text: string) => {
		return (
			<>
				<span>{text}</span>
				<span className={styles.fieldRequired}>*</span>
			</>
		)
	}

	const errorText = (errorMessage: string) => {
		return (
			<Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
				{errorMessage}
			</Text>
		)
	}

	const {
		handleSubmit
	} = useForm()

	const handleResetForm = () => {
		setLicenseCertificationTitle('')
		setIssuingOrganisation('')
		setIsLicenseCertificationPermanent(false)
		setIssueDate(null)
		setExpiryDate(null)
		setHasErrorOnExpiryDate(false)
		setCredentialId('')
		setCredentialUrl('')
		setHasValidationError(true)
	}

	const handleCloseModal = () => {
		handleModal(modalName, false)
		handleResetForm()
	}

	const onSubmit = () => {
		const data = {
			title: licenseCertificationTitle,
			issuing_organisation: issuingOrganisation,
			is_permanent: isLicenseCertificationPermanent,
			issue_date: moment(new Date(issueDate)).format('yyyy-MM-DD'),
			expiry_date: isLicenseCertificationPermanent == true ? null : moment(new Date(expiryDate)).format('yyyy-MM-DD'),
		}

		if (credentialId.length > 0) {
			data['credential_id'] = credentialId
		}

		if (credentialUrl.length > 0) {
			data['credential_url'] = credentialUrl
		}

		const licenseCertificationPayload = {
			isUpdate: licenseData ? true : false,
			licenseId: licenseData ? licenseData.id : null,
			licenseData: data
		}

		dispatch(manageUserLicensesAndCertificationsRequest(licenseCertificationPayload))
	}

	const validateInput = () => {
		if (
			licenseCertificationTitle?.length > 0
			&& issuingOrganisation?.length > 0
			&& issueDate !== null
			&& (isLicenseCertificationPermanent === true) || (expiryDate !== null)
		) {
			setHasValidationError(false)
		} else {
			setHasValidationError(true)
		}
	}

	useEffect(() => {
		if (licenseData) {
			setLicenseCertificationTitle(licenseData.title)
			setIssuingOrganisation(licenseData.issuing_organisation)
			setIsLicenseCertificationPermanent(licenseData.is_permanent)
			setIssueDate(licenseData.issue_date || null)
			setExpiryDate(licenseData.expiry_date || null)
			setCredentialId(licenseData.credential_id || '')
			setCredentialUrl(licenseData.credential_url || '')
			setHasValidationError(true)
			validateInput()
		}
	}, [licenseData])

	useEffect(() => {
		const periodIssue = moment(new Date(issueDate))
		const periodExpiry = moment(new Date(expiryDate))

		setHasErrorOnExpiryDate(moment(periodIssue).isAfter(periodExpiry) ? true : false)
	}, [issueDate, expiryDate])

	useEffect(() => {
		handleCloseModal()
	}, [updateLicensesAndCertificationsSuccess])

	useEffect(() => {
		validateInput()
	}, [
		licenseCertificationTitle,
		issuingOrganisation,
		issueDate,
		expiryDate,
		isLicenseCertificationPermanent
	])

	const editLicensesAndCertificationsModal = (
		<div className={styles.container}>
			<div className={styles.formWrapper}>
				<div id='form' className={styles.form}>
					<div className={styles.field}>
						<MaterialTextField
							className={styles.fullWidth}
							label={requiredLabel('Title of licenses/certification')}
							size='small'
							variant='outlined'
							value={licenseCertificationTitle}
							defaultValue={licenseCertificationTitle}
							onChange={(e) => setLicenseCertificationTitle(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<MaterialTextField
							className={styles.fullWidth}
							label={requiredLabel('Issuing organisation')}
							variant='outlined'
							value={issuingOrganisation}
							defaultValue={issuingOrganisation}
							onChange={(e) => setIssuingOrganisation(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<div>
							<Text bold textStyle='lg'>
								License/certification validity<span className={styles.fieldRequired}>*</span>
							</Text>
						</div>
						<div>
							<FormControlLabel
								control={
									<Switch
										checked={isLicenseCertificationPermanent}
										onChange={() => setIsLicenseCertificationPermanent(!isLicenseCertificationPermanent)}
										name='isLicenseCertificationPermanent'
									/>
								}
								label={
									<Text textStyle='lg'>
										This license or certificate doesn't expire
									</Text>
								}
							/>
						</div>
					</div>
					<div className={styles.field}>
						<div className={classNames(styles.fieldDate)}>
							<div className={styles.fieldDateItem}>
								<MaterialDatePicker
									label='Issue date'
									views={['year', 'month']}
									inputFormat='MMM yyyy'
									value={issueDate}
									onDateChange={(value) => {
											setIssueDate(value)
									}}
								/>
							</div>
						</div>
					</div>
					{!isLicenseCertificationPermanent && (
						<div className={styles.field}>
							<div className={classNames(styles.fieldDate)}>
								<div className={styles.fieldDateItem}>
									<MaterialDatePicker
										label='Expiry date'
										views={['year', 'month']}
										inputFormat='MMM yyyy'
										value={expiryDate}
										onDateChange={(value) => {
												setExpiryDate(value)
										}}
									/>
								</div>
								{hasErrorOnExpiryDate && (
									<Text textColor='red' textStyle='sm'>
										Issue date must be earlier than expiry date.
									</Text>
								)}
							</div>
						</div>
					)}
					<div className={styles.field}>
						<MaterialTextField
							className={styles.fullWidth}
							label='Credential ID'
							variant='outlined'
							value={credentialId}
							defaultValue={credentialId}
							onChange={(e) => setCredentialId(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<MaterialTextField
							className={styles.fullWidth}
							label='Credential URL'
							variant='outlined'
							value={credentialUrl}
							defaultValue={credentialUrl}
							onChange={(e) => setCredentialUrl(e.target.value)}
						/>
					</div>
					{credentialUrl && (
						errorText(urlValidation(credentialUrl))
					)}
				</div>
			</div>
		</div>
	)

	return (
		<div>
			<ModalDialog
				open={showModal}
				onClose={handleCloseModal}
				headerTitle='Licenses And Certifications'
				firstButtonText='Cancel'
				secondButtonText='Save'
				isSecondButtonLoading={isUpdating}
				isSecondButtonDisabled={hasValidationError}
				firstButtonIsClose
				handleFirstButton={handleCloseModal}
				handleSecondButton={handleSubmit(onSubmit)}
				fullScreen
				maxHeight='90vh'
			>
				{editLicensesAndCertificationsModal}
			</ModalDialog>
		</div>
	)

}

export default EditLicensesAndCertificationsModal