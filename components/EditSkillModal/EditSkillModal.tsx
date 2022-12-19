/* eslint-disable camelcase */
import { useEffect, useState, useMemo, useCallback } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Actions */

/* Components */
import { Chip } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import Text from 'components/Text'
import Modal from 'components/Modal'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'

/* Helpers */
import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'
import { keys, flatMap } from 'lodash-es'
/* Styles */
import styles from './EditSkillModal.module.scss'
import JobFunctionSelector from 'components/JobFunctionSelector';

type EditSkillModalProps = {
  modalName: string
  showModal: boolean
  categoryList: any
  skills: any
  handleModal: Function
}

const EditSkillModal = ({
  modalName,
  showModal,
  categoryList,
  skills,
  handleModal,
}: EditSkillModalProps) => {
  const dispatch = useDispatch()
  const {
    handleSubmit
  } = useForm()

  const [choosed, setChoosed] = useState(skills)
  const [searchValue, setSearchValue] = useState('')
  const [functionTitle, setFunctionTitle] = useState({ value: '', id: undefined, })
  const [suggestList, setSuggestList] = useState([])
  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )
  const jobFunctionLists = useSelector(
    (store: any) => store.config?.config?.response?.inputs?.job_function_lists ?? []
  )

  const skillList = useMemo(() => {
    const jobFunction = flatMap(jobFunctionLists, item => {
      const key = keys(item)?.[0]
      return item[key] ?? []
    }).find(item => {
      return item.job_titles.find(title => title.id === functionTitle?.id)
    })
    return jobFunction?.skills ?? []
  }, [functionTitle, jobFunctionLists])

  const handleSuggestionSearch = useCallback(value => {
    setSuggestList(
      skillList.filter(item => item.value.includes(value))
        .map(skill => ({ value: skill.id, label: skill.value }))
    )
  }, [skillList])

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
    setChoosed(choosed.filter(item => item !== skill))
  }

  const handleAddSkill = (skill) => {
    setChoosed(prevState => {
      if (!prevState.includes(skill.label)) {
        return [...prevState, skill.label]
      } else {
        return [...prevState]
      }
    })
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
  }

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle='Skills'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdatingUserProfile}
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        <div>
          <Text>We will suggest skill for you according to your latest job function:</Text>
          <div className={styles.form}>
            <JobFunctionSelector
              id='jobFunction'
              label='Job Function'
              options={categoryList}
              className={styles.sortField}
              isTouched={true}
              value={functionTitle}
              onChange={setFunctionTitle}
            />
          </div>
          <div className={styles.form}>
            <MaterialTextFieldWithSuggestionList
              id='search'
              label='Search or add a skill'
              variant='outlined'
              size='small'
              value={searchValue}
              className={styles.searchField}
              updateSearchValue={setSearchValue}
              searchFn={handleSuggestionSearch}
              onSelect={(val: any) => {
                if (val !== '') {
                  handleAddSkill(val)
                  setSearchValue('')
                }
              }}
              onKeyPress={(e: any) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  setSearchValue(e.target.value)

                  if (e.target.value !== '') {
                    handleAddSkill(e.target.value)
                    setSearchValue('')
                  }
                }
              }}
              options={suggestList}
            />
          </div>
          <div className={styles.skillList}>
            {choosed.map((skill, i) => {
              return (
                <Chip
                  key={i}
                  className={styles.skillChip}
                  label={skill}
                  variant='filled'
                  color='info'
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
