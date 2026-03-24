export const nonEmpty = (value: string): boolean => value.trim().length > 0

export const nonEmptyList = (values: string[]): string[] => values.map((value) => value.trim()).filter((value) => value.length > 0)

export const formatRange = (
  startDate: string,
  endDate: string,
  isCurrent: boolean,
  dateFormat: 'month' | 'year',
  locale: string,
  presentLabel: string
): string => {
  const startRaw = startDate.trim()
  const endRaw = endDate.trim()

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    ...(dateFormat === 'month' ? { year: 'numeric', month: 'long' } : { year: 'numeric' }),
  }

  let formatter: Intl.DateTimeFormat
  try {
    // Force English locale for date formatting
    formatter = new Intl.DateTimeFormat('en-US', formatOptions)
  } catch (e) {
    // Fallback
    formatter = new Intl.DateTimeFormat('en', formatOptions)
  }

  const parseDate = (dateStr: string) => {
    if (!dateStr) return ''

    // Attempt to convert YYYY or YYYY-MM to a full ISO string for reliable Date parsing
    let isoString: string
    if (dateStr.length === 4) { // YYYY
      isoString = `${dateStr}-01-01T00:00:00Z`
    } else if (dateStr.length === 7 && dateStr.includes('-')) { // YYYY-MM
      isoString = `${dateStr}-01T00:00:00Z`
    } else {
      // For other formats, try parsing directly or return original string if it's not a valid date
      isoString = dateStr
    }

    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
      // Fallback for non-standard formats (e.g. legacy text inputs that are not YYYY or YYYY-MM)
      return dateStr
    }

    return formatter.format(date)
  }

  const start = parseDate(startRaw)
  const end = isCurrent ? presentLabel : parseDate(endRaw)

  if (start && end) {
    return `${start} - ${end}`
  }

  if (start) {
    return start
  }

  if (end) {
    return end
  }

  return ''
}
