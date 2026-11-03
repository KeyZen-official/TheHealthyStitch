import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The shadcn class helper. `clsx` flattens conditionals and arrays,
 * `tailwind-merge` then drops any earlier utility that a later one would
 * fight with, so a caller's `className` always wins over the component's
 * own defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
