const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function getTodayDate(): string {
  const now = new Date()
  return formatDate(now)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getDayName(dateStr: string): string {
  const date = parseDate(dateStr)
  return DAYS[date.getDay()]
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export function formatDateDisplay(dateStr: string): string {
  const date = parseDate(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayStr = formatDate(today)
  const yesterdayStr = formatDate(yesterday)

  if (dateStr === todayStr) {
    return 'Today'
  }

  if (dateStr === yesterdayStr) {
    return 'Yesterday'
  }

  const dayName = DAYS[date.getDay()]
  const monthName = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const currentYear = today.getFullYear()

  // "Tuesday, January 6th" or "Tuesday, January 6th 2025" if different year
  if (year === currentYear) {
    return `${dayName}, ${monthName} ${day}${getOrdinalSuffix(day)}`
  }
  return `${dayName}, ${monthName} ${day}${getOrdinalSuffix(day)} ${year}`
}

export function formatDateJournal(dateStr: string): string {
  const date = parseDate(dateStr)
  const today = new Date()
  const todayStr = formatDate(today)

  const dayName = DAYS[date.getDay()]
  const monthName = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  const formatted = `${day}${getOrdinalSuffix(day)} ${monthName} ${year}, ${dayName}`

  if (dateStr === todayStr) {
    return `Today is ${formatted}`
  }
  return formatted
}

export function formatDateForMarkdown(dateStr: string): string {
  const dayName = getDayName(dateStr)
  return `${dateStr} (${dayName})`
}

export function dateToPath(dateStr: string): string {
  return `/${dateStr.replace(/-/g, '/')}`
}

export function pathToDate(year: string, month: string, day: string): string {
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function matchesSearch(dateStr: string, search: string): boolean {
  if (!search.trim()) return true

  const date = parseDate(dateStr)
  const searchLower = search.toLowerCase().trim()

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const dayName = DAYS[date.getDay()].toLowerCase()
  const monthName = MONTHS[month].toLowerCase()
  const monthShort = MONTHS_SHORT[month].toLowerCase()

  const searchTerms = searchLower.split(/\s+/)

  return searchTerms.every(term => {
    return (
      String(day).includes(term) ||
      String(year).includes(term) ||
      String(year).slice(-2).includes(term) ||
      dayName.includes(term) ||
      monthName.includes(term) ||
      monthShort.includes(term) ||
      dateStr.includes(term) ||
      term === 'today' ||
      term === 'yesterday'
    )
  })
}
