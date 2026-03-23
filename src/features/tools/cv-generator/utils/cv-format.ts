export const nonEmpty = (value: string): boolean => value.trim().length > 0

export const nonEmptyList = (values: string[]): string[] => values.map((value) => value.trim()).filter((value) => value.length > 0)

export const formatRange = (startDate: string, endDate: string): string => {
  const start = startDate.trim()
  const end = endDate.trim()

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
