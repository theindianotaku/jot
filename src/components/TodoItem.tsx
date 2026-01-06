import { useRef, useEffect, KeyboardEvent } from 'react'
import { Copy, X } from 'lucide-react'
import { TodoNode } from '../types'

interface TodoItemProps {
  node: TodoNode
  depth: number
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
  onIndent: (id: string) => void
  onOutdent: (id: string) => void
  onNewSibling: (id: string) => void
  onCopy: (id: string) => void
  onFocus: (id: string) => void
  isFocused: boolean
}

export function TodoItem({
  node,
  depth,
  onUpdate,
  onDelete,
  onIndent,
  onOutdent,
  onNewSibling,
  onCopy,
  onFocus,
  isFocused,
}: TodoItemProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) {
        onOutdent(node.id)
      } else {
        onIndent(node.id)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onNewSibling(node.id)
    } else if (e.key === 'Delete' && e.shiftKey) {
      e.preventDefault()
      onDelete(node.id)
    } else if (e.key === 'Backspace' && node.content === '') {
      e.preventDefault()
      onDelete(node.id)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, e.target.value)
  }

  const handleFocus = () => {
    onFocus(node.id)
  }

  return (
    <div className="todo-item" style={{ marginLeft: depth * 24 }}>
      <span className="todo-bullet">•</span>
      <input
        ref={inputRef}
        type="text"
        className="todo-input"
        value={node.content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder="Enter task..."
      />
      <button
        className="todo-btn todo-copy"
        onClick={() => onCopy(node.id)}
        title="Copy"
      >
        <Copy size={14} />
      </button>
      <button
        className="todo-btn todo-delete"
        onClick={() => onDelete(node.id)}
        title="Delete (Shift+Delete)"
      >
        <X size={16} />
      </button>
    </div>
  )
}
