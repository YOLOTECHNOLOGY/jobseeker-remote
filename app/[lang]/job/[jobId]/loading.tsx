import { Skeleton, Stack } from 'app/[lang]/components/MUIs'
import styles from './page.module.scss'

const Loading = () => {
  return (
    <div className={styles.skeleton}>
      <Stack spacing={1} sx={{ width: '100%' }}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant='text' width={'100%'} height={80} />
        <Skeleton width={'100%'} height={20} className={styles.skeleton_webHead} />
        <Stack spacing={2} direction='row' className={styles.skeleton_webHead}>
          <Skeleton variant='text' width={80} height={80} />
          <Skeleton variant='text' width={80} height={80} />
        </Stack>

        <div className={styles.skeleton_mobileHead}>
          <Stack direction='row' spacing={2}>
            <Stack spacing={1} width={'30%'}>
              <Skeleton variant='circular' width={80} height={80} />
            </Stack>
            <Stack spacing={1} width={'70%'}>
              <Skeleton width={'100%'} height={20} />
              <Skeleton width={'100%'} height={20} />
              <Skeleton width={'100%'} height={20} />
            </Stack>
          </Stack>
        </div>

        <Stack spacing={2} direction='row'>
          <Stack spacing={1} width={'70%'} className={styles.skeleton_left}>
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
          </Stack>
          <Stack spacing={1} width={'30%'} className={styles.skeleton_right}>
            <div className={styles.skeleton_mobileHead}>
              <Skeleton width={'100%'} height={20} />
              <Skeleton width={'100%'} height={20} />
              <Skeleton width={'100%'} height={20} />
              <Skeleton width={'100%'} height={20} />
            </div>
            <Skeleton width={'100%'} height={20} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton variant='circular' width={40} height={40} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton variant='circular' width={40} height={40} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton width={'100%'} height={20} />
            <Skeleton variant='circular' width={40} height={40} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Skeleton width={'100%'} height={20} />
          </Stack>
        </Stack>
      </Stack>
    </div>
  )
}

export default Loading
