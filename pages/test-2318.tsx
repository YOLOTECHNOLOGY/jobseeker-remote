import Layout from '../components/Layout'
import ProfileLayout from '../components/ProfileLayout'
import ProfileSettingCard from '../components/ProfileSettingCard'

// TODO: Remove this page after testing
export default function Page() {
  return (
    <Layout>
      <ProfileLayout
        name='John Doe'
        location='Manila Philippines'
        email='johndoe@test.com'
        contactNumber='+65 91812121'
        currentTab='profile'
      >
        <ProfileSettingCard
          title='Work Experience'
          description='Showcase your past contributions and that you can be an asset to potential employer.'
          buttonText='Add work experience'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Education'
          description='Highlight your academic qualifications and achievements.'
          buttonText='Add education'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Skills'
          description='Include relevant skill and keywords to boost your chances of getting an interview.'
          buttonText='Add skills'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Links'
          description='Show recruiters your work by sharing your websites, portfolio, articles, or any relevant links.'
          buttonText='Add links'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Licences And Certifications'
          description='Stand out among the rest by sharing that expertise that you have earned to show your passion for the job.'
          buttonText='Add licenses & cert'
          // eslint-disable-next-line
          onClick={() => {}}
        />
      </ProfileLayout>
    </Layout>
  )
}
