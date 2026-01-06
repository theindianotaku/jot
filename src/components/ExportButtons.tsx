import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { TodoNode, ExportFormat } from '../types'
import { exportContent } from '../utils/export'

interface ExportButtonsProps {
  previously: TodoNode[]
  today: TodoNode[]
  exportFormat: ExportFormat
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  'slack-default': 'Copy for Slack',
  'slack-markup': 'Copy for Slack',
  'markdown': 'Copy as Markdown',
}

export function ExportButtons({ previously, today, exportFormat }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = exportContent(exportFormat, previously, today)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasContent = previously.length > 0 || today.length > 0

  return (
    <div className="bottom-bar">
      <button
        className="export-btn"
        onClick={handleCopy}
        disabled={!hasContent}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        <span>{copied ? 'Copied!' : FORMAT_LABELS[exportFormat]}</span>
      </button>
    </div>
  )
}
