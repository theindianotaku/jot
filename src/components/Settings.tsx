import { Settings as SettingsIcon, ChevronDown, Check } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Select from '@radix-ui/react-select'
import { AppSettings, ExportFormat } from '../types'

interface SettingsProps {
  settings: AppSettings
  onUpdate: (updates: Partial<AppSettings>) => void
}

export function Settings({ settings, onUpdate }: SettingsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="icon-btn" title="Settings">
          <SettingsIcon size={20} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdown-content" sideOffset={8} side="top" align="start">
          <DropdownMenu.CheckboxItem
            className="dropdown-checkbox-item"
            checked={settings.copyPreviousEntry}
            onCheckedChange={checked => onUpdate({ copyPreviousEntry: checked === true })}
            onSelect={e => e.preventDefault()}
          >
            <div className="checkbox-box">
              {settings.copyPreviousEntry && <Check size={12} />}
            </div>
            <span>Import previous entry's tasks</span>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="dropdown-separator" />

          <div className="dropdown-select-item">
            <span className="dropdown-label">Export format</span>
            <Select.Root
              value={settings.exportFormat}
              onValueChange={value => onUpdate({ exportFormat: value as ExportFormat })}
            >
              <Select.Trigger className="select-trigger">
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={14} />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className="select-content" position="popper" sideOffset={4}>
                  <Select.Viewport>
                    <Select.Item value="slack-default" className="select-item">
                      <Select.ItemText>Slack (plain text)</Select.ItemText>
                      <Select.ItemIndicator className="select-item-indicator">
                        <Check size={14} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="slack-markup" className="select-item">
                      <Select.ItemText>Slack (with markup)</Select.ItemText>
                      <Select.ItemIndicator className="select-item-indicator">
                        <Check size={14} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item value="markdown" className="select-item">
                      <Select.ItemText>Markdown (Obsidian, etc.)</Select.ItemText>
                      <Select.ItemIndicator className="select-item-indicator">
                        <Check size={14} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
