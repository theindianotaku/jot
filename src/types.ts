export interface TodoNode {
  id: string
  content: string
  children: TodoNode[]
}

export interface DailyEntry {
  date: string // YYYY-MM-DD
  previously: TodoNode[]
  today: TodoNode[]
}

export type ExportFormat = 'slack-default' | 'slack-markup' | 'markdown'

export interface AppSettings {
  copyPreviousEntry: boolean
  exportFormat: ExportFormat
}
