import TextEditor from 'components/TextEditor'
import React, { useState, useEffect, useRef } from 'react'

const TextArea = () => {
    const [value, setValue] = useState()
    const valueRef = useRef(value)
    useEffect(() => {
        valueRef.current = value
    }, [value])
    useEffect(() => {
        window.textController = {
            setText: setValue,
            getText: () => valueRef.current
        }
        return () => window.textController = null
    }, [])
    return <TextEditor value={value} setValue={setValue} />
}
export default TextArea