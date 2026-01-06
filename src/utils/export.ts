import { TodoNode, ExportFormat } from '../types'

// Slack mrkdwn: *bold*, _italic_, <url|text>
function convertToSlackMrkdwn(content: string): string {
  let result = content
  // Bold: **text** -> *text*
  result = result.replace(/\*\*(.+?)\*\*/g, '*$1*')
  // Links: [text](url) -> <url|text>
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<$2|$1>')
  return result
}

// Plain text: strip markdown syntax
function convertToPlainText(content: string): string {
  let result = content
  // Remove bold: **text** -> text
  result = result.replace(/\*\*(.+?)\*\*/g, '$1')
  // Remove italic: *text* or _text_ -> text
  result = result.replace(/\*(.+?)\*/g, '$1')
  result = result.replace(/_(.+?)_/g, '$1')
  // Convert links: [text](url) -> text (url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
  // Remove code backticks
  result = result.replace(/`(.+?)`/g, '$1')
  return result
}

// Slack default: plain text with simple dashes
function renderTodoTreeSlackDefault(nodes: TodoNode[], indent: number = 0): string {
  const lines: string[] = []
  const prefix = '    '.repeat(indent)

  for (const node of nodes) {
    const content = convertToPlainText(node.content)
    lines.push(`${prefix}- ${content}`)

    if (node.children.length > 0) {
      lines.push(renderTodoTreeSlackDefault(node.children, indent + 1))
    }
  }

  return lines.join('\n')
}

// Slack markup: mrkdwn with * bullets
function renderTodoTreeSlackMarkup(nodes: TodoNode[], indent: number = 0): string {
  const lines: string[] = []
  const prefix = '    '.repeat(indent)

  for (const node of nodes) {
    const content = convertToSlackMrkdwn(node.content)
    lines.push(`${prefix}* ${content}`)

    if (node.children.length > 0) {
      lines.push(renderTodoTreeSlackMarkup(node.children, indent + 1))
    }
  }

  return lines.join('\n')
}

// Standard markdown
function renderTodoTreeMarkdown(nodes: TodoNode[], indent: number = 0): string {
  const lines: string[] = []
  const prefix = '\t'.repeat(indent)

  for (const node of nodes) {
    lines.push(`${prefix}- ${node.content}`)

    if (node.children.length > 0) {
      lines.push(renderTodoTreeMarkdown(node.children, indent + 1))
    }
  }

  return lines.join('\n')
}

function exportSlackDefault(previously: TodoNode[], today: TodoNode[]): string {
  const lines: string[] = ['Daily Standup']

  lines.push('')
  lines.push('Previously')
  if (previously.length > 0) {
    lines.push(renderTodoTreeSlackDefault(previously))
  }

  lines.push('')
  lines.push('Today')
  if (today.length > 0) {
    lines.push(renderTodoTreeSlackDefault(today))
  }

  return lines.join('\n')
}

function exportSlackMarkup(previously: TodoNode[], today: TodoNode[]): string {
  const lines: string[] = ['*Daily Standup*']

  lines.push('')
  lines.push('*Previously*')
  if (previously.length > 0) {
    lines.push(renderTodoTreeSlackMarkup(previously))
  }

  lines.push('')
  lines.push('*Today*')
  if (today.length > 0) {
    lines.push(renderTodoTreeSlackMarkup(today))
  }

  return lines.join('\n')
}

function exportMarkdown(previously: TodoNode[], today: TodoNode[]): string {
  const lines: string[] = ['**Daily Standup**']

  lines.push('')
  lines.push('**Previously**')
  if (previously.length > 0) {
    lines.push(renderTodoTreeMarkdown(previously))
  }

  lines.push('')
  lines.push('**Today**')
  if (today.length > 0) {
    lines.push(renderTodoTreeMarkdown(today))
  }

  return lines.join('\n')
}

export function exportContent(
  format: ExportFormat,
  previously: TodoNode[],
  today: TodoNode[]
): string {
  switch (format) {
    case 'slack-default':
      return exportSlackDefault(previously, today)
    case 'slack-markup':
      return exportSlackMarkup(previously, today)
    case 'markdown':
      return exportMarkdown(previously, today)
  }
}
