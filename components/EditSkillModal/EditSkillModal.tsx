/* eslint-disable camelcase */
import { useEffect, useState, useMemo, useCallback } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Actions */
import { manageUserWorkExperiencesRequest } from 'store/actions/users/manageUserWorkExperiences'

/* Components */
import { Chip } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import Text from 'components/Text'
import Modal from 'components/Modal'
import MaterialTextField from 'components/MaterialTextField'

/* Helpers */
import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

import { keys, flatMap } from 'lodash-es'
/* Styles */
import styles from './EditSkillModal.module.scss'
import JobFunctionSelector from 'components/JobFunctionSelector'
import { getCookie } from 'helpers/cookies'


type EditSkillModalProps = {
  modalName: string
  showModal: boolean
  categoryList: any
  skills: any
  handleModal: Function
  lang: Record<string, any>
}

const EditSkillModal = ({
  modalName,
  showModal,
  categoryList,
  skills,
  handleModal,
  lang
}: EditSkillModalProps) => {
  const {
    manageProfile: {
      tab: {
        profile: { skillModal }
      }
    }
  } = lang
  const dispatch = useDispatch()
  const { handleSubmit } = useForm()

  const [choosed, setChoosed] = useState(skills)
  const [searchValue, setSearchValue] = useState('')
  const [functionTitle, setFunctionTitle] = useState({ value: '', id: undefined })
  const [suggestList, setSuggestList] = useState([])
  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateProfileSuccess = useSelector((store: any) => store.users.updateUserProfile.response)
  const jobFunctionLists = useSelector(
    (store: any) => store.config?.config?.response?.inputs?.job_function_lists ?? []
  )

  const accessToken = getCookie('accessToken')

  const skillList = useMemo(() => {
    const jobFunction = flatMap(jobFunctionLists, (item) => {
      const key = keys(item)?.[0]
      return item[key] ?? []
    }).find((item) => {
      return item.job_titles.find((title) => title.id === functionTitle?.id)
    })
    return jobFunction?.skills ?? []
  }, [functionTitle, jobFunctionLists])

  const handleSuggestionSearch = useCallback(
    (value) => {
      const reg = new RegExp(value, 'gi')
      setSuggestList(
        skillList
          .filter((item) => reg.test(item.value))
          .map((skill) => ({ value: skill.id, label: skill.value }))
      )
    },
    [skillList.toString()]
  )
  useEffect(() => {
    setSuggestList(skillList.map((skill) => ({ value: skill.id, label: skill.value })))
  }, [handleSuggestionSearch, searchValue])

  useEffect(() => {
    if (updateProfileSuccess) {
      handleCloseModal()
    }
  }, [updateProfileSuccess])

  const onSubmit = () => {
    const payload = {
      skills: choosed.join(',')
    }
    dispatch(updateUserProfileRequest(payload))

  }

  const handleDeleteSkill = (skill) => {
    setChoosed(choosed.filter((item) => item !== skill))
  }

  const handleAddSkill = (skill) => {
    setChoosed((prevState) => {
      if (!prevState?.includes?.(skill)) {
        return [...prevState, skill]
      } else {
        return [...prevState]
      }
    })
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
    handleResetForm()
  }

  const handleClearIcon = () => {
    setSearchValue('')
  }
  const handleResetForm = () => {
    setFunctionTitle({ value: '', id: undefined })
    setSearchValue('')
  }

  console.log('choosed:', functionTitle)

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle={skillModal.title}
        firstButtonText={skillModal.btn1}
        secondButtonText={skillModal.btn2}
        isSecondButtonLoading={isUpdatingUserProfile}
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        <div>
          <Text>{skillModal.suggestions}</Text>
          <div className={styles.form}>
            <JobFunctionSelector
              id='jobFunction'
              label={skillModal.jobFunction}
              options={categoryList}
              className={styles.sortField}
              isTouched={true}
              title={lang.profile.jobFunction}
              value={functionTitle}
              onChange={(item) => setFunctionTitle({
                id: item.id,
                value: item.value
              })}
            />
          </div>
          <div className={styles.form}>
            <MaterialTextField
              id='search'
              label={skillModal.skill}
              variant='outlined'
              size='small'
              value={searchValue}
              className={styles.searchField}
              onChange={e => setSearchValue(e.target.value)}
              InputProps={{
                endAdornment: searchValue ? <ClearIcon style={{ cursor: 'pointer' }} onClick={handleClearIcon} /> : null
              }}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  if (e.target.value !== '') {
                    handleAddSkill(e.target.value)
                    setSearchValue('')
                  }
                }
              }}
            />
          </div>
          <div className={styles.skillList}>
            {(choosed ?? []).map((skill, i) => {
              return (
                <Chip
                  key={i}
                  className={styles.skillChip}
                  label={skill}
                  variant='filled'
                  color='primary'
                  size='small'
                  onClick={() => {
                    handleDeleteSkill(skill)
                  }}
                  icon={<ClearIcon />}
                />
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditSkillModal
