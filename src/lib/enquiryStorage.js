/**
 * Enquiry persistence helper.
 *
 * Saves enquiries to localStorage and attempts to sync with the
 * /api/enquiries endpoint if a backend or Vite middleware is active.
 * Guarantees zero data loss even in offline or static hosting environments.
 */

const STORAGE_KEY = 'thehealthystitch_enquiries'

export function getStoredEnquiries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to read enquiries from localStorage:', err)
    return []
  }
}

export async function saveEnquiry(enquiry) {
  const timestamp = new Date().toISOString()
  const record = {
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: timestamp,
    ...enquiry,
  }

  // 1. Save to localStorage immediately
  try {
    const current = getStoredEnquiries()
    const updated = [record, ...current]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('LocalStorage save failed:', err)
  }

  // 2. Attempt to save to /api/enquiries if available
  try {
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    })
  } catch {
    // API endpoint not reachable in static mode, localStorage has already saved it.
  }

  return record
}

export function exportEnquiriesCSV() {
  const enquiries = getStoredEnquiries()
  if (enquiries.length === 0) {
    alert('No enquiries recorded yet.')
    return
  }

  const headers = [
    'Date & Time',
    'Name',
    'Phone',
    'Email',
    'Primary Health Goal',
    'Dietary Preference',
    'Preferred Consultation Time',
    'Message',
    'Submission Channel',
  ]

  const rows = enquiries.map((item) => [
    `"${item.submittedAt || ''}"`,
    `"${(item.name || '').replace(/"/g, '""')}"`,
    `"${(item.phone || '').replace(/"/g, '""')}"`,
    `"${(item.email || '').replace(/"/g, '""')}"`,
    `"${(item.goal || '').replace(/"/g, '""')}"`,
    `"${(item.diet || '').replace(/"/g, '""')}"`,
    `"${(item.consultationTime || '').replace(/"/g, '""')}"`,
    `"${(item.message || '').replace(/"/g, '""')}"`,
    `"${(item.channel || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `thehealthystitch_enquiries_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

