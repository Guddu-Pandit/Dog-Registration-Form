import { useState, useMemo } from 'react'

const DOG_COLORS = ['', 'Black', 'White', 'Brown', 'Gray']

const US_STATES = [
  '',
  // States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
]

const EMPTY = {
  dogName: '', dogBreed: '', dogColor1: '', dogColor2: '',
  dogDob: '', dogGender: '', neutered: '', spayed: '',
  ownerName: '', email: '', address: '', city: '', state: '',
  postalCode: '', phoneNum: '',
}

function validate(f) {
  const e = {}
  if (!f.dogName.trim())              e.dogName    = 'Dog name is required'
  else if (f.dogName.trim().length < 3) e.dogName  = 'Must be at least 3 characters'
  if (!f.dogBreed.trim())             e.dogBreed   = 'Breed is required'
  if (!f.dogColor1)                   e.dogColor1  = 'Primary color is required'
  if (!f.dogDob)                      e.dogDob     = 'Date of birth is required'
  else if (new Date(f.dogDob) > new Date()) e.dogDob = 'Cannot be in the future'
  if (!f.dogGender)                   e.dogGender  = 'Gender is required'
  if (!f.neutered)                    e.neutered   = 'Select Yes or No'
  if (!f.spayed)                      e.spayed     = 'Select Yes or No'
  if (!f.ownerName.trim())            e.ownerName  = 'Owner name is required'
  if (!f.email.trim())                e.email      = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email address'
  if (!f.address.trim())              e.address    = 'Address is required'
  if (!f.city.trim())                 e.city       = 'City is required'
  if (!f.state)                       e.state      = 'State is required'
  if (!f.postalCode.trim())           e.postalCode = 'Postal code is required'
  else if (!/^\d+$/.test(f.postalCode)) e.postalCode = 'Digits only'
  if (!f.phoneNum.trim())             e.phoneNum   = 'Phone is required'
  else if (!/^\d{10}$/.test(f.phoneNum)) e.phoneNum = 'Must be exactly 10 digits'
  return e
}

function Field({ label, required, error, touched, children }) {
  return (
    <div className={`field ${touched && error ? 'field--error' : ''}`}>
      <label className="field-label">
        {label}{required && <span className="required">*</span>}
      </label>
      {children}
      <p className={`error-msg ${touched && error ? 'error-msg--visible' : ''}`}>{touched && error ? error : ' '}</p>
    </div>
  )
}

function RadioGroup({ name, options, value, onChange, onBlur }) {
  return (
    <div className="radio-group">
      {options.map((o) => (
        <label key={o.value} className="radio-label">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={onChange} onBlur={onBlur} />
          {o.label}
        </label>
      ))}
    </div>
  )
}

function Toast({ items, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      {items.map((n) => (
        <div key={n.id} className={`toast toast--${n.type}`}>
          <span className="toast-icon">{n.type === 'success' ? '✓' : '✕'}</span>
          <span className="toast-msg">{n.message}</span>
          <button className="toast-close" onClick={() => onDismiss(n.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm]           = useState(EMPTY)
  const [touched, setTouched]     = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts]       = useState([])

  const errors      = useMemo(() => validate(form), [form])
  const isFormValid = Object.keys(errors).length === 0
  const totalFields = Object.keys(EMPTY).length
  const doneFields  = totalFields - Object.keys(errors).length
  const pct         = Math.round((doneFields / totalFields) * 100)

  function set(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }
  function touch(field) { return () => setTouched((t) => ({ ...t, [field]: true })) }
  function showErr(field) { return touched[field] ? errors[field] : undefined }
  function inputCls(field) {
    if (!touched[field]) return 'input'
    return errors[field] ? 'input input-error' : 'input input-ok'
  }

  function addToast(type, message) {
    const id = Date.now()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((n) => n.id !== id)), 5000)
  }

  function touchAll() {
    const all = {}
    Object.keys(EMPTY).forEach((k) => { all[k] = true })
    setTouched(all)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid || isSubmitting) { touchAll(); return }

    setIsSubmitting(true)
    try {
      const res  = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const json = await res.json()

      if (json.success) {
        addToast('success', `${form.dogName} registered successfully!`)
        setForm(EMPTY)
        setTouched({})
      } else {
        // server-side validation errors
        if (json.errors) {
          const mapped = {}
          Object.keys(json.errors).forEach((k) => { mapped[k] = true })
          setTouched((t) => ({ ...t, ...mapped }))
        }
        addToast('error', json.message || 'Registration failed.')
      }
    } catch {
      addToast('error', 'Network error — could not reach the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setForm(EMPTY)
    setTouched({})
  }

  const genderOpts  = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]
  const yesNoOpts   = [{ value: 'yes',  label: 'Yes'  }, { value: 'no',     label: 'No'     }]

  return (
    <div className="page">
      <Toast items={toasts} onDismiss={(id) => setToasts((t) => t.filter((n) => n.id !== id))} />

      <header className="form-header">
        <div className="header-paw">🐾</div>
        <h1>Dog Registration</h1>
        <p>Complete the form below to register your dog</p>
      </header>

      <div className="progress-wrap" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-label" aria-live="polite">
        {isFormValid ? 'All fields complete — ready to submit!' : `${doneFields} / ${totalFields} fields complete`}
      </p>

      <form className="reg-form" onSubmit={handleSubmit} noValidate>

        {/* ── Dog Information ── */}
        <section className="form-section">
          <h2 className="section-title">Dog Information</h2>
          <div className="grid-2">

            <Field label="Dog Name" required error={errors.dogName} touched={!!touched.dogName}>
              <input className={inputCls('dogName')} type="text" placeholder="e.g. Buddy (min 3 chars)"
                value={form.dogName} onChange={set('dogName')} onBlur={touch('dogName')} />
            </Field>

            <Field label="Dog Breed" required error={errors.dogBreed} touched={!!touched.dogBreed}>
              <input className={inputCls('dogBreed')} type="text" placeholder="e.g. Golden Retriever"
                value={form.dogBreed} onChange={set('dogBreed')} onBlur={touch('dogBreed')} />
            </Field>

            <Field label="Primary Color" required error={errors.dogColor1} touched={!!touched.dogColor1}>
              <select className={inputCls('dogColor1')} value={form.dogColor1}
                onChange={set('dogColor1')} onBlur={touch('dogColor1')}>
                <option value="">Select a color</option>
                {DOG_COLORS.filter(Boolean).map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Secondary Color">
              <select className="input" value={form.dogColor2} onChange={set('dogColor2')}>
                <option value="">None / Optional</option>
                {DOG_COLORS.filter(Boolean).map((c) => <option key={c}>{c}</option>)}
              </select>
              <p className="error-msg">&nbsp;</p>
            </Field>

            <Field label="Date of Birth" required error={errors.dogDob} touched={!!touched.dogDob}>
              <input className={inputCls('dogDob')} type="date"
                max={new Date().toISOString().split('T')[0]}
                value={form.dogDob} onChange={set('dogDob')} onBlur={touch('dogDob')} />
            </Field>

            <Field label="Gender" required error={errors.dogGender} touched={!!touched.dogGender}>
              <RadioGroup name="dogGender" options={genderOpts} value={form.dogGender}
                onChange={set('dogGender')} onBlur={touch('dogGender')} />
            </Field>

            <Field label="Neutered" required error={errors.neutered} touched={!!touched.neutered}>
              <RadioGroup name="neutered" options={yesNoOpts} value={form.neutered}
                onChange={set('neutered')} onBlur={touch('neutered')} />
            </Field>

            <Field label="Spayed" required error={errors.spayed} touched={!!touched.spayed}>
              <RadioGroup name="spayed" options={yesNoOpts} value={form.spayed}
                onChange={set('spayed')} onBlur={touch('spayed')} />
            </Field>

          </div>
        </section>

        {/* ── Owner Information ── */}
        <section className="form-section">
          <h2 className="section-title">Owner Information</h2>
          <div className="grid-2">

            <Field label="Owner Name" required error={errors.ownerName} touched={!!touched.ownerName}>
              <input className={inputCls('ownerName')} type="text" placeholder="Full name"
                value={form.ownerName} onChange={set('ownerName')} onBlur={touch('ownerName')} />
            </Field>

            <Field label="Email Address" required error={errors.email} touched={!!touched.email}>
              <input className={inputCls('email')} type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} onBlur={touch('email')} />
            </Field>

            <Field label="Phone Number" required error={errors.phoneNum} touched={!!touched.phoneNum}>
              <input className={inputCls('phoneNum')} type="tel" inputMode="numeric"
                placeholder="10-digit number" maxLength={10}
                value={form.phoneNum} onChange={set('phoneNum')} onBlur={touch('phoneNum')} />
            </Field>

            <div className="grid-full">
              <Field label="Street Address" required error={errors.address} touched={!!touched.address}>
                <input className={inputCls('address')} type="text" placeholder="123 Main St"
                  value={form.address} onChange={set('address')} onBlur={touch('address')} />
              </Field>
            </div>

            <Field label="City" required error={errors.city} touched={!!touched.city}>
              <input className={inputCls('city')} type="text" placeholder="City"
                value={form.city} onChange={set('city')} onBlur={touch('city')} />
            </Field>

            <Field label="State" required error={errors.state} touched={!!touched.state}>
              <select className={inputCls('state')} value={form.state}
                onChange={set('state')} onBlur={touch('state')}>
                <option value="">Select a state</option>
                {US_STATES.filter(Boolean).map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Postal Code" required error={errors.postalCode} touched={!!touched.postalCode}>
              <input className={inputCls('postalCode')} type="text" inputMode="numeric"
                placeholder="Digits only" maxLength={10}
                value={form.postalCode} onChange={set('postalCode')} onBlur={touch('postalCode')} />
            </Field>

          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleReset} disabled={isSubmitting}>
            Clear Form
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            onClick={!isFormValid ? touchAll : undefined}
          >
            {isSubmitting ? (
              <><span className="spinner" /> Registering…</>
            ) : isFormValid ? (
              'Register Dog'
            ) : (
              'Complete all fields'
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
