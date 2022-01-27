import React, { useCallback, useState, useEffect, forwardRef, Ref, PropsWithChildren } from 'react'

/* Vendors */
import isHotkey from 'is-hotkey'
import { Editor, Transforms, Range, Element as SlateElement } from 'slate'

import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'

/* Components */
import Image from 'next/image'

/* Helpers */
import { getItem, setItem, removeItem } from 'helpers/localStorage'
import { HOTKEYS, STORAGE_NAME, LIST_TYPES } from 'helpers/richTextEditor'

/* Styles */
import styles from './TextEditor.module.scss'

/* Images */
import { VectorBulletedListIcon, VectorNumberedListIcon } from 'images'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type CustomText = { text: string; strong?: boolean }

type CustomElement = {
  type: string
  children: CustomText[]
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

  const onChange = (value) => {
    setValue(value)

    const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type)
    if (isAstChange) {
      // Save the value to Local Storage.
      const content = JSON.stringify(value)
      // const contentObj = {
      //   children: value,
      // }
      // const htmlValue = console.log('serialize abc', serialize(contentObj))
      setItem(STORAGE_NAME, content)
      // setItem(STORAGE_NAME, serialize(content))
    }
  }

  const handleBackspace: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Backspace') {
      const { selection } = editor
      if (
        selection &&
        selection.focus.offset === 0 &&
        selection.anchor.offset === 0 &&
        Range.isCollapsed(selection)
      ) {
        const node = editor.children[selection.anchor.path[0]]
        if (LIST_TYPES.includes((node as CustomElement).type)) {
          toggleBlock(editor, 'list-item')
        }
      }
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
    handleBackspace(event)
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
    // @ts-ignore
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    // @ts-ignore
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
      // @ts-ignore
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
