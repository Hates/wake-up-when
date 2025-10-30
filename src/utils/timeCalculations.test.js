import { describe, it, expect } from 'vitest'
import { calculateWakeUpTime, calculateTotalMinutes } from './timeCalculations'

describe('calculateWakeUpTime', () => {
  it('calculates wake-up time correctly for simple case', () => {
    const trainTime = '09:00'
    const stages = [
      { id: 1, duration: 20, enabled: true },
      { id: 2, duration: 30, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('08:10')
  })

  it('handles disabled stages correctly', () => {
    const trainTime = '09:00'
    const stages = [
      { id: 1, duration: 20, enabled: true },
      { id: 2, duration: 30, enabled: false },
      { id: 3, duration: 10, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('08:30')
  })

  it('handles time wrapping to previous day', () => {
    const trainTime = '01:00'
    const stages = [
      { id: 1, duration: 120, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('23:00')
  })

  it('returns empty string for empty train time', () => {
    const result = calculateWakeUpTime('', [])
    expect(result).toBe('')
  })

  it('handles multiple stages correctly', () => {
    const trainTime = '08:50'
    const stages = [
      { id: 1, duration: 20, enabled: true },
      { id: 2, duration: 55, enabled: true },
      { id: 3, duration: 60, enabled: true },
      { id: 4, duration: 20, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('06:15')
  })
})

describe('calculateTotalMinutes', () => {
  it('calculates total minutes for enabled stages', () => {
    const stages = [
      { id: 1, duration: 20, enabled: true },
      { id: 2, duration: 30, enabled: true },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(50)
  })

  it('ignores disabled stages', () => {
    const stages = [
      { id: 1, duration: 20, enabled: true },
      { id: 2, duration: 30, enabled: false },
      { id: 3, duration: 10, enabled: true },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(30)
  })

  it('returns 0 for empty array', () => {
    const result = calculateTotalMinutes([])
    expect(result).toBe(0)
  })

  it('returns 0 when all stages are disabled', () => {
    const stages = [
      { id: 1, duration: 20, enabled: false },
      { id: 2, duration: 30, enabled: false },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(0)
  })
})
