/**
 * Calculate wake-up time based on train time and stage durations
 * @param {string} trainTime - Time in HH:MM format
 * @param {Array} stages - Array of stage objects with duration and enabled properties
 * @returns {string} Wake-up time in HH:MM format
 */
export function calculateWakeUpTime(trainTime, stages) {
  if (!trainTime) {
    return ''
  }

  // Parse train time
  const [hours, minutes] = trainTime.split(':').map(Number)
  let totalMinutes = hours * 60 + minutes

  // Subtract all enabled stage durations
  const totalStageMinutes = stages
    .filter(stage => stage.enabled)
    .reduce((sum, stage) => sum + (parseInt(stage.duration) || 0), 0)

  totalMinutes -= totalStageMinutes

  // Handle negative time (previous day)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60
  }

  // Convert back to hours and minutes
  const wakeHours = Math.floor(totalMinutes / 60)
  const wakeMinutes = totalMinutes % 60

  return `${String(wakeHours).padStart(2, '0')}:${String(wakeMinutes).padStart(2, '0')}`
}

/**
 * Calculate total enabled minutes from stages
 * @param {Array} stages - Array of stage objects
 * @returns {number} Total minutes
 */
export function calculateTotalMinutes(stages) {
  return stages
    .filter(stage => stage.enabled)
    .reduce((sum, stage) => sum + (parseInt(stage.duration) || 0), 0)
}
