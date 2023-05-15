/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
'use client'
/* Vendors */
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

/* Styles */
import styles from './TextEditor.module.scss'

interface TextEditorInterface {
  value: string
  setValue: any
  placeholder?: string
}

// Refer to link below for React-quill implementation on Nextjs:
// https://www.simplenextjs.com/posts/react-quill
// eslint-disable-next-line no-unused-vars
const QuillNoSSRWrapper =
  typeof window !== 'undefined' &&
  dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>
  })

const modules = {
  toolbar: [[{ list: 'ordered' }, { list: 'bullet' }]]
}

const formats = ['list', 'bullet']

const TextEditor = ({ value, setValue, placeholder = 'Type here...' }: TextEditorInterface) => {
  return (
    <div className={styles.textEditor}>
      {QuillNoSSRWrapper ? (
        <QuillNoSSRWrapper
          theme='snow'
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          value={value}
          onChange={setValue}
        />
      ) : null}
    </div>
  )
}

export default TextEditor
