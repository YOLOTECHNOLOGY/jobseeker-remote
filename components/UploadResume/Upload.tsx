import { useRef } from 'react'

type uploadProps = {
  onChange: (event) => void
}
export const Upload = ({ onChange }: uploadProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const handleOnFileChange = (event) => {
    onChange?.(event)
    ref.current.value = ''
  }
  return (
    <input
      ref={ref}
      type='file'
      hidden
      accept='.pdf, .doc, .docx'
      onChange={(e) => handleOnFileChange(e)}
    />
  )
}
