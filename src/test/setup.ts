import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear()
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
