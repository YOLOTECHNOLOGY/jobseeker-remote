/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Actions */

/* Components */
import { Chip } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import Text from 'components/Text'
import ModalDialog from 'components/ModalDialog'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'

/* Helpers */
import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'

/* Styles */
import styles from './EditSkillModal.module.scss'

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

  const [skillList, setSkillList] = useState(skills || [])
  const [suggestionList, setSuggestionList] = useState([])

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )

  const handleSuggestionSearch = (val) => {
    if (val !== '') {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
  }

  useEffect(() => {
    handleCloseModal()
  }, [updateProfileSuccess])

  const onSubmit = () => {
    const payload = {
      skills: skillList.join(',')
    }

    dispatch(updateUserProfileRequest(payload))
  }

  const handleDeleteSkill = (skill) => {
    setSkillList(skillList.filter(item => item !== skill))
  }

  const handleAddSkill = (skill) => {
    setSkillList(prevState => [...prevState, skill])
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
  }

  return (
    <div>
      <ModalDialog
        open={showModal}
        onClose={handleCloseModal}
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
            <MaterialBasicSelect
              id='jobFunction'
              label='Job Function'
              options={categoryList}
              className={styles.sortField}
            />
          </div>
          <div className={styles.form}>
            <MaterialTextFieldWithSuggestionList
              id='search'
              label='Search or add a skill'
              variant='outlined'
              size='small'
              className={styles.searchField}
              searchFn={handleSuggestionSearch}
              onSelect={(val: any) => {
                if (val !== '') {
                  handleAddSkill(val)
                }
              }}
              onKeyPress={(e: any) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  setSuggestionList([])

                  if (e.target.value !== '') {
                    handleAddSkill(e.target.value)
                  }
                }
              }}
              options={suggestionList}
            />
          </div>
          <div className={styles.skillList}>
            {skillList.map((skill, i) => {
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
      </ModalDialog>
    </div>
  )
}

export default EditSkillModal
