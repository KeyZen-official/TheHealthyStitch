import { useEffect, useState } from 'react'
import { X, Download, Trash2, Search, Inbox, Phone, Mail, Clock, Calendar, CheckCircle } from 'lucide-react'
import { getStoredEnquiries, exportEnquiriesCSV } from '../lib/enquiryStorage.js'

export default function AdminEnquiryModal({ isOpen, onClose }) {
  const [enquiries, setEnquiries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (isOpen) {
      setEnquiries(getStoredEnquiries())
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = enquiries.filter(
    (e) =>
      e.name?.toLowerCase().includes(filter.toLowerCase()) ||
      e.goal?.toLowerCase().includes(filter.toLowerCase()) ||
      e.customGoal?.toLowerCase().includes(filter.toLowerCase()) ||
      e.phone?.includes(filter) ||
      e.diet?.toLowerCase().includes(filter.toLowerCase()) ||
      e.customDiet?.toLowerCase().includes(filter.toLowerCase())
  )


  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all stored enquiries? This cannot be undone.')) {
      localStorage.removeItem('thehealthystitch_enquiries')
      setEnquiries([])
    }
  }

  return (
    <div
      className="admin-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="admin-modal__dialog">
        <header className="admin-modal__header">
          <div>
            <div className="admin-modal__badge">Website Administration</div>
            <h2 className="admin-modal__title" id="admin-modal-title">
              Enquiry Management System
            </h2>
            <p className="admin-modal__subtitle">
              All website enquiries received through WhatsApp and Email are saved here for administrative review.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close Admin Portal"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="admin-modal__toolbar">
          <div className="admin-modal__search">
            <Search className="admin-modal__search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name, goal, phone, diet..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="admin-modal__actions">
            <button
              type="button"
              className="admin-modal__btn admin-modal__btn--export"
              onClick={exportEnquiriesCSV}
              disabled={enquiries.length === 0}
            >
              <Download className="admin-modal__btn-icon" aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              className="admin-modal__btn admin-modal__btn--clear"
              onClick={handleClear}
              disabled={enquiries.length === 0}
            >
              <Trash2 className="admin-modal__btn-icon" aria-hidden="true" />
              Clear All
            </button>
          </div>
        </div>

        <div className="admin-modal__content">
          {filtered.length === 0 ? (
            <div className="admin-modal__empty">
              <Inbox className="admin-modal__empty-icon" aria-hidden="true" />
              <p>No enquiries found{filter ? ' matching your search' : ' yet'}.</p>
              <span className="admin-modal__empty-sub">
                New enquiries submitted through the website form will appear here automatically.
              </span>
            </div>
          ) : (
            <div className="admin-modal__list">
              {filtered.map((item) => (
                <article key={item.id} className="admin-card">
                  <div className="admin-card__head">
                    <div className="admin-card__user">
                      <h3 className="admin-card__name">{item.name}</h3>
                      <span className="admin-card__time">
                        <Calendar className="admin-card__mini-icon" />
                        {new Date(item.submittedAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <div className="admin-card__badges">
                      <span className="admin-card__pill admin-card__pill--goal">
                        {item.goal === 'Other' && item.customGoal ? `Other: ${item.customGoal}` : item.goal}
                      </span>
                      <span className="admin-card__pill admin-card__pill--diet">
                        {item.diet === 'Other' && item.customDiet ? `Other: ${item.customDiet}` : item.diet}
                      </span>
                      <span className="admin-card__pill admin-card__pill--channel">
                        via {item.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-card__meta">
                    <span className="admin-card__meta-item">
                      <Phone className="admin-card__mini-icon" />
                      <a href={`tel:${item.phone}`}>{item.phone}</a>
                    </span>
                    {item.email && (
                      <span className="admin-card__meta-item">
                        <Mail className="admin-card__mini-icon" />
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                      </span>
                    )}
                    <span className="admin-card__meta-item">
                      <Clock className="admin-card__mini-icon" />
                      Preferred: <strong>{item.consultationTime}</strong>
                    </span>
                  </div>

                  {item.message && (
                    <div className="admin-card__note">
                      <strong>Client Note:</strong> &ldquo;{item.message}&rdquo;
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="admin-modal__footer">
          <span>
            Total Enquiries Saved: <strong>{enquiries.length}</strong>
          </span>
          <button type="button" className="admin-modal__close-btn" onClick={onClose}>
            Close Portal
          </button>
        </footer>
      </div>
    </div>
  )
}

