import React, { useCallback, useState, useEffect, forwardRef, Ref, PropsWithChildren } from 'react'

/* Vendors */
import isHotkey from 'is-hotkey'
import { Editor, Transforms, Element as SlateElement } from 'slate'

import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'

/* Components */
import Image from 'next/image'

/* Helpers */
import { getItem, setItem, removeItem } from 'helpers/localStorage'
import { HOTKEYS, STORAGE_NAME, LIST_TYPES, serialize, deserialize } from 'helpers/richTextEditor'

/* Styles */
import styles from './TextEditor.module.scss'

/* Images */
import { VectorBulletedListIcon, VectorNumberedListIcon } from 'images'

interface BaseProps {
  className: string
  [key: string]: unknown
}

const TextEditorField = () => {
  const [value, setValue] = useState<Descendant[]>(initialEditorValue)
  // renderLeaf activates bold, italic, underline
  // const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const [editor] = useState(() => withHistory(withReact(createEditor() as ReactEditor)))

  useEffect(() => {
    const initialValue = JSON.parse(getItem(STORAGE_NAME)) || initialEditorValue
    setValue(initialValue)
    editor.children = initialValue

    return () => {
      removeItem(STORAGE_NAME)
    }
  }, [])

  useEffect(() => {
    console.log('value', value)
  }, [value])

  const onChange = (value) => {
    setValue(value)

    const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type)
    if (isAstChange) {
      // Save the value to Local Storage.
      const content = JSON.stringify(value)
      console.log('serialize value', serialize(value))
      const abc = {
        children:value
      }
      const htmlValue = console.log('serialize abc', serialize(abc))
      const contentObject =  JSON.stringify({
        html: htmlValue,
        slate: content
      })
      // const contentObject =  JSON.stringify({
      //   html: htmlValue,
      //   slate: content
      // })
      setItem(STORAGE_NAME, content)
      // setItem(STORAGE_NAME, serialize(content))
    }
  }

  const onKeyDown = (event) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey]
        toggleMark(editor, mark)
      }
    }
    console.log('onKeyDown event.target.value', event.target.value)
  }

  return (
    <div className={styles.textEditor}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <div className={styles.toolBar}>
          <NumberedListButton format='numbered-list' />
          <BulletedListButton format='bulleted-list' />
        </div>
        <div>
          <Editable
            renderElement={renderElement}
            // renderLeaf={renderLeaf}
            placeholder='Type here...'
            spellCheck
            autoFocus
            onKeyDown={onKeyDown}
            className={styles.editable}
          />
        </div>
      </Slate>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

// eslint-disable-next-line
const Element = ({ attributes, children, element }) => {
  // eslint-disable-next-line
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const BulletedListButton = ({ format }: any) => {
  const editor = useSlate()
  return (
    <IconButton
      // NOTE: isBlockActive to be uncommented if stylings is required for active/inactive state
      // active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Image src={VectorBulletedListIcon} alt='logo' width='22' height='22' />
    </IconButton>
  )
}

const NumberedListButton = ({ format }: any) => {
  const editor = useSlate()
  return (
    <IconButton
      // NOTE: isBlockActive to be uncommented if stylings is required for active/inactive state
      // active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Image src={VectorNumberedListIcon} alt='logo' width='22' height='22' />
    </IconButton>
  )
}

// eslint-disable-next-line
const IconButton = forwardRef(
  (
    {
      // active,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => <span {...props} ref={ref} className={styles.toolBarIcon} />
)

// const Leaf = ({ attributes, children, leaf }:any) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>
//   }

//   if (leaf.code) {
//     children = <code>{children}</code>
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>
//   }

//   if (leaf.underline) {
//     children = <u>{children}</u>
//   }

//   return <span {...attributes}>{children}</span>
// }

// const initialValue: Descendant[] = []

const initialEditorValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export default TextEditorField
