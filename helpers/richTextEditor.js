import { Node, Text, Editor, Transforms, Element as SlateElement } from 'slate'
import escapeHtml from 'escape-html'

const STORAGE_NAME = 'slate-rte'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

// Define a serializing function that takes a value and returns a string.
const serialize = (node) => {
  console.log('node', node)
  console.log('Text.isText(node)', Text.isText(node))
  console.log('node.text', node.text)
  console.log('node.type', node.type)
  console.log('node.children', node.children)
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children?.map((n) => serialize(n)).join('')

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    case 'bulleted-list':
      return `<ul>${children}</ul>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    default:
      return children
  }
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => {
  console.log('deserialize string', string)
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line) => {
    return {
      children: [{ text: line }],
    }
  })
}

export { STORAGE_NAME, HOTKEYS, LIST_TYPES, serialize, deserialize }
