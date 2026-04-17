export const formatSeconds = (seconds) => {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

const toNumber = (value) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

export const mapOutcomeDistributionData = (outcomeDistributions = [], getColor) => {
  if (!Array.isArray(outcomeDistributions)) return []

  return outcomeDistributions.map((item, index) => ({
    name: item?.categoryName || `Category ${index + 1}`,
    value: toNumber(item?.occurrences),
    share: toNumber(item?.sharePercentage),
    color: typeof getColor === 'function' ? getColor(item?.categoryName, index) : '#6B7280',
  }))
}

export const mapPeakActivityData = (peakActivityTrends = []) => {
  if (!Array.isArray(peakActivityTrends)) return []

  return peakActivityTrends.map((item, index) => ({
    slot: item?.timeSlot || `Slot ${index + 1}`,
    volume: toNumber(item?.volume),
  }))
}

export const mapPropertyStatusData = (propertyInventoryStatus = [], getColor) => {
  if (!Array.isArray(propertyInventoryStatus)) return []

  const normalizedData = propertyInventoryStatus.map((item, index) => ({
    name: item?.statusName || `Status ${index + 1}`,
    count: toNumber(item?.count),
    percentage: toNumber(item?.percentage),
    color: typeof getColor === 'function' ? getColor(item?.statusName, index) : '#6B7280',
  }))

  return [...normalizedData].sort((a, b) => b.count - a.count)
}
