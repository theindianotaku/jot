import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { Plus } from 'lucide-react'
import { TodoNode } from '../types'
import { TodoItem } from './TodoItem'

interface TodoEditorProps {
  title: string
  nodes: TodoNode[]
  onChange: (nodes: TodoNode[]) => void
}

interface FlatNode {
  node: TodoNode
  depth: number
  path: number[] // indices to reach this node
}

function flattenTree(nodes: TodoNode[], depth: number = 0, path: number[] = []): FlatNode[] {
  const result: FlatNode[] = []
  nodes.forEach((node, index) => {
    const currentPath = [...path, index]
    result.push({ node, depth, path: currentPath })
    if (node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1, currentPath))
    }
  })
  return result
}

function cloneTree(nodes: TodoNode[]): TodoNode[] {
  return JSON.parse(JSON.stringify(nodes))
}

function getNodeAtPath(nodes: TodoNode[], path: number[]): TodoNode | null {
  if (path.length === 0) return null
  let current = nodes[path[0]]
  for (let i = 1; i < path.length; i++) {
    if (!current || !current.children[path[i]]) return null
    current = current.children[path[i]]
  }
  return current
}

function getParentAndIndex(
  nodes: TodoNode[],
  path: number[]
): { parent: TodoNode[] | null; index: number; grandparent: TodoNode[] | null; parentIndex: number } {
  if (path.length === 1) {
    return { parent: nodes, index: path[0], grandparent: null, parentIndex: -1 }
  }

  const parentPath = path.slice(0, -1)
  const parentNode = getNodeAtPath(nodes, parentPath)
  if (!parentNode) {
    return { parent: null, index: -1, grandparent: null, parentIndex: -1 }
  }

  let grandparent: TodoNode[] | null = null
  let parentIndex = -1

  if (parentPath.length === 1) {
    grandparent = nodes
    parentIndex = parentPath[0]
  } else if (parentPath.length > 1) {
    const grandparentPath = parentPath.slice(0, -1)
    const grandparentNode = getNodeAtPath(nodes, grandparentPath)
    if (grandparentNode) {
      grandparent = grandparentNode.children
      parentIndex = parentPath[parentPath.length - 1]
    }
  }

  return {
    parent: parentNode.children,
    index: path[path.length - 1],
    grandparent,
    parentIndex,
  }
}

export function TodoEditor({ title, nodes, onChange }: TodoEditorProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const flatNodes = flattenTree(nodes)

  const findPathById = useCallback(
    (id: string): number[] | null => {
      const flat = flattenTree(nodes)
      const found = flat.find(f => f.node.id === id)
      return found ? found.path : null
    },
    [nodes]
  )

  const handleUpdate = useCallback(
    (id: string, content: string) => {
      const path = findPathById(id)
      if (!path) return

      const newNodes = cloneTree(nodes)
      const node = getNodeAtPath(newNodes, path)
      if (node) {
        node.content = content
        onChange(newNodes)
      }
    },
    [nodes, onChange, findPathById]
  )

  const handleDelete = useCallback(
    (id: string) => {
      const path = findPathById(id)
      if (!path) return

      const newNodes = cloneTree(nodes)
      const { parent, index } = getParentAndIndex(newNodes, path)

      if (parent && index >= 0) {
        // Find next item to focus
        const flat = flattenTree(newNodes)
        const currentIndex = flat.findIndex(f => f.node.id === id)
        const nextFocus =
          flat[currentIndex + 1]?.node.id || flat[currentIndex - 1]?.node.id || null

        parent.splice(index, 1)
        onChange(newNodes)
        setFocusedId(nextFocus)
      }
    },
    [nodes, onChange, findPathById]
  )

  const handleIndent = useCallback(
    (id: string) => {
      const path = findPathById(id)
      if (!path) return

      const { parent, index } = getParentAndIndex(nodes, path)
      if (!parent || index <= 0) return // Can't indent first item or invalid

      const newNodes = cloneTree(nodes)
      const newParentInfo = getParentAndIndex(newNodes, path)
      if (!newParentInfo.parent) return

      const [item] = newParentInfo.parent.splice(index, 1)
      const prevSibling = newParentInfo.parent[index - 1]
      prevSibling.children.push(item)

      onChange(newNodes)
    },
    [nodes, onChange, findPathById]
  )

  const handleOutdent = useCallback(
    (id: string) => {
      const path = findPathById(id)
      if (!path || path.length < 2) return // Can't outdent root level

      const newNodes = cloneTree(nodes)
      const { parent, index, grandparent, parentIndex } = getParentAndIndex(newNodes, path)

      if (!parent || !grandparent || parentIndex < 0) return

      const [item] = parent.splice(index, 1)
      grandparent.splice(parentIndex + 1, 0, item)

      onChange(newNodes)
    },
    [nodes, onChange, findPathById]
  )

  const handleNewSibling = useCallback(
    (id: string) => {
      const path = findPathById(id)
      if (!path) return

      const newNodes = cloneTree(nodes)
      const { parent, index } = getParentAndIndex(newNodes, path)

      if (!parent) return

      const newNode: TodoNode = {
        id: nanoid(),
        content: '',
        children: [],
      }

      parent.splice(index + 1, 0, newNode)
      onChange(newNodes)
      setFocusedId(newNode.id)
    },
    [nodes, onChange, findPathById]
  )

  const handleCopy = useCallback(
    (id: string) => {
      const path = findPathById(id)
      if (!path) return

      const node = getNodeAtPath(nodes, path)
      if (node) {
        navigator.clipboard.writeText(node.content)
      }
    },
    [nodes, findPathById]
  )

  const handleAddNew = useCallback(() => {
    const newNode: TodoNode = {
      id: nanoid(),
      content: '',
      children: [],
    }
    onChange([...nodes, newNode])
    setFocusedId(newNode.id)
  }, [nodes, onChange])

  return (
    <div className="todo-editor">
      <div className="todo-editor-header">
        <h3 className="todo-editor-title">{title}</h3>
        <button className="icon-btn icon-btn-sm" onClick={handleAddNew} title="Add item">
          <Plus size={16} />
        </button>
      </div>
      <div className="todo-list">
        {flatNodes.map(({ node, depth }) => (
          <TodoItem
            key={node.id}
            node={node}
            depth={depth}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onIndent={handleIndent}
            onOutdent={handleOutdent}
            onNewSibling={handleNewSibling}
            onCopy={handleCopy}
            onFocus={setFocusedId}
            isFocused={focusedId === node.id}
          />
        ))}
      </div>
    </div>
  )
}
