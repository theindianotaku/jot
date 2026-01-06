import { Lightbulb, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

export function ProTips() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="icon-btn" title="Pro Tips">
          <Lightbulb size={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content pro-tips-dialog">
          <div className="dialog-header">
            <Lightbulb size={20} />
            <Dialog.Title className="dialog-title">Pro Tips</Dialog.Title>
            <Dialog.Close asChild>
              <button className="dialog-close">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description asChild>
            <ul className="pro-tips-list">
              <li>
                <kbd>Tab</kbd> to indent and <kbd>Shift</kbd> + <kbd>Tab</kbd> to outdent
              </li>
              <li>
                <kbd>Enter</kbd> creates a new item
              </li>
              <li>
                <kbd>Backspace</kbd> deletes empty items
              </li>
              <li>
                Supports basic Markdown syntax (e.g., <code>`code`</code>, <code>**bold**</code>)
              </li>
            </ul>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
