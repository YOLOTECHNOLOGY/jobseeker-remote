/* Vendors */
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

/* Styles */
import styles from './TextEditor.module.scss'

interface TextEditorInterface {
  value: string
  setValue: any
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  toolbar: [
    [{ list: 'ordered' }, { list: 'bullet' }]
  ],
}

const formats = ['list', 'bullet']

const TextEditor = ( { value, setValue } : TextEditorInterface) => {
  return (
    <div className={styles.textEditor}>
      <QuillNoSSRWrapper
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Type here..."
        value={value}
        onChange={setValue}
      />
    </div>
  )
}

export default TextEditor
