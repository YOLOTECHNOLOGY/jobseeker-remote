import Layout from '../components/Layout'
import ProfileLayout from '../components/ProfileLayout'
import JobPreferencesCard from 'components/JobPreferencesLayout/JobPreferencesCard/JobPreferencesCard'
import OpenToWorkCard from 'components/JobPreferencesLayout/OpenToWorkCard/OpenToWorkCard'

// TODO: Remove this page after testing
export default function JobPreferencesLayout() {
  return (
    <Layout>
      <ProfileLayout
        name='John Doe'
        location='Manila Philippines'
        email='johndoe@test.com'
        contactNumber='+65 91812121'
        currentTab='job preferences'
      >
        <JobPreferencesCard
            title='Job Preferences'
            jobTitle='Customer Service Executive'
            jobType='Full-time'
            expectedSalary='P1,000 - P2,000'
            workingLocation='Manila, Philippines'
            workingSetting='Work from home'
            availability='Immediate'
        />
        <OpenToWorkCard
            title='Open to work'
        />
      </ProfileLayout>
    </Layout>
  )
}