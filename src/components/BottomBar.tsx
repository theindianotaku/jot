import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Settings } from './Settings'
import { ProTips } from './ProTips'
import { TodoNode, AppSettings } from '../types'
import { exportContent } from '../utils/export'

interface BottomBarProps {
  previously: TodoNode[]
  today: TodoNode[]
  settings: AppSettings
  onUpdateSettings: (updates: Partial<AppSettings>) => void
  isEmpty?: boolean
}

export function BottomBar({ previously, today, settings, onUpdateSettings, isEmpty }: BottomBarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = exportContent(settings.exportFormat, previously, today)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasContent = previously.length > 0 || today.length > 0

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-left">
        <ProTips />
        {!isEmpty && <Settings settings={settings} onUpdate={onUpdateSettings} />}
      </div>
      {!isEmpty && (
        <div className="bottom-bar-right">
          <button
            className="btn btn-primary"
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
