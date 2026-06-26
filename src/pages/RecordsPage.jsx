import { useState, useEffect } from 'react'

const LIMIT = 10

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function Badge({ value }) {
  const yes = value === 'yes'
  return <span className={`badge badge--${yes ? 'yes' : 'no'}`}>{yes ? 'Y' : 'N'}</span>
}

export default function RecordsPage() {
  const [records,   setRecords]   = useState([])
  const [total,     setTotal]     = useState(0)
  const [pages,     setPages]     = useState(1)
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [query,     setQuery]     = useState('')       // debounced
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  // Debounce search → query
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch whenever page / query / sortOrder changes
  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page, limit: LIMIT, search: query, sortOrder })
        const res  = await fetch(`/api/registrations?${params}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        if (!json.success) throw new Error(json.message)
        setRecords(json.data)
        setTotal(json.total)
        setPages(json.pages)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load records.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [page, query, sortOrder])

  function toggleSort() { setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc')); setPage(1) }

  const start = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const end   = Math.min(page * LIMIT, total)

  return (
    <div className="page">
      <header className="form-header">
        <div className="header-paw">📋</div>
        <h1>Registered Dogs</h1>
        <p>{total} record{total !== 1 ? 's' : ''} in the database</p>
      </header>

      {/* ── Controls ── */}
      <div className="records-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            className="input search-input"
            placeholder="Search by dog name, owner or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
          )}
        </div>
        <button className="btn-secondary sort-btn" onClick={toggleSort}>
          Date {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </button>
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="center-state">
          <span className="spinner-lg" />
          <p>Loading records…</p>
        </div>
      )}

      {!loading && error && (
        <div className="center-state error-state">
          <span className="state-icon">⚠️</span>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => setPage((p) => p)} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-state-icon">🐾</div>
          <h3 className="empty-state-title">No Records Found</h3>
          <p className="empty-state-msg">
            {query
              ? `No registrations match "${query}". Try a different search term.`
              : 'There are no dog registrations yet. Register a dog to see records here.'}
          </p>
          {query && (
            <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setSearch('')}>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && records.length > 0 && (
        <>
          <p className="records-meta">Showing {start}–{end} of {total}</p>

          <div className="table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Dog Name</th>
                  <th>Color</th>
                  <th>DOB</th>
                  <th>Owner</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Neutered</th>
                  <th>Spayed</th>
                  <th>Phone</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td data-label="Dog Name">
                      <strong>{r.dogName}</strong>
                      <br />
                      <small className="sub-text">{r.dogBreed}</small>
                    </td>
                    <td data-label="Color">
                      {r.dogColor1}
                      {r.dogColor2 ? <><br /><small className="sub-text">{r.dogColor2}</small></> : null}
                    </td>
                    <td data-label="DOB">{formatDate(r.dogDob)}</td>
                    <td data-label="Owner">
                      {r.ownerName}
                      <br />
                      <small className="sub-text">{r.email}</small>
                    </td>
                    <td data-label="City">{r.city}</td>
                    <td data-label="State">{r.state}</td>
                    <td data-label="Neutered"><Badge value={r.neutered} /></td>
                    <td data-label="Spayed"><Badge value={r.spayed} /></td>
                    <td data-label="Phone">{r.phoneNum}</td>
                    <td data-label="Registered">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="pagination">
            <button className="pg-btn" onClick={() => setPage(1)}            disabled={page === 1}>«</button>
            <button className="pg-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</button>
            <span className="page-info">Page {page} of {pages}</span>
            <button className="pg-btn" onClick={() => setPage((p) => p + 1)} disabled={page === pages}>›</button>
            <button className="pg-btn" onClick={() => setPage(pages)}         disabled={page === pages}>»</button>
          </div>
        </>
      )}
    </div>
  )
}
