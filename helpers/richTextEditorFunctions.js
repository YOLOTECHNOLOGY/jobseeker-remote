/* Vendor */
import { Transforms, Text, Editor } from 'slate'

const isBoldMarkActive = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.bold === true,
    universal: true,
  })

  return !!match
}

const isCodeBlockActive = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === 'code',
  })

  return !!match
}

const toggleBoldMark = (editor) => {
  const isActive = isBoldMarkActive(editor)
  Transforms.setNodes(
    editor,
    { bold: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  )
}

const toggleCodeBlock = (editor) => {
  const isActive = isCodeBlockActive(editor)
  Transforms.setNodes(
    editor,
    { type: isActive ? null : 'code' },
    { match: (n) => Editor.isBlock(editor, n) }
  )
}

export { isBoldMarkActive, isCodeBlockActive, toggleBoldMark, toggleCodeBlock }
