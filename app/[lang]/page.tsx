
import Main from './main-page/page'
import styles from './index.module.scss'
import { getDictionary } from '../../get-dictionary'
export default async (props) => {
    const {lang} = props.params
    const dictionary = await getDictionary(lang)
    const newProps = {...props,lang:dictionary}
    return <div className={styles.container}>
         {/* @ts-expect-error Async Server Component */}
          <Main {...newProps} />
    </div>
}