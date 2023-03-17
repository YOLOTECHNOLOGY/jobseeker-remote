import { TextField, Button, Stack } from 'app/components/MUIs'

import styles from '../../../page.module.scss'

const SignUp = () => {
  return (
    <section className={styles.signUp}>
      <h3>Join Bossjob</h3>
      <div>
        <Stack spacing={2}>
          <TextField label='Email address' variant='outlined' />
          <Button variant='contained'>Sign up</Button>
        </Stack>
      </div>
      <p className={styles.signUp_userProtocol}>
        By signing up, I have read and agreed to the <a href=''>Terms of Use</a> &
        <a href=''>Privacy Policy</a>
      </p>
    </section>
  )
}

export default SignUp
