import { Routes, Route, NavLink } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import RecordsPage  from './pages/RecordsPage'
import './App.css'

export default function App() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">🐾 DogReg</div>
        <div className="nav-links">
          <NavLink to="/"        end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Register</NavLink>
          <NavLink to="/records"     className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Records</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/"        element={<RegisterPage />} />
        <Route path="/records" element={<RecordsPage />} />
      </Routes>
    </>
  )
}
