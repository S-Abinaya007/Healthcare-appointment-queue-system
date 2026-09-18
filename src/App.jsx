import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import './App.css'
import DoctorDashboard from './pages/DoctorDashboard'

function App() {

  const [page, setPage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)

  if (page === 'login') {
    return (
      <Login
        setPage={setPage}
        setCurrentUser={setCurrentUser}
      />
    )
  }

  if (page === 'register') {
    return (
      <Register setPage={setPage} />
    )
  }

  if (page === 'patient') {
    return (
      <PatientDashboard
        setPage={setPage}
        currentUser={currentUser}
      />
    )
  }
  if (page === 'doctor') {
  return (
    <DoctorDashboard
      setPage={setPage}
      currentUser={currentUser}
    />
  )
}

  return (
    <div className="app">

      <nav className="navbar">

        <h2>HealthCare</h2>

        <div className="nav-links">

          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>

          <button onClick={() => setPage('login')}>
            Login
          </button>

        </div>

      </nav>

      <section className="hero">

        <div className="hero-content">

          <h1>
            Healthcare Appointment & Queue
            <br />
            Management System
          </h1>

          <p>
            Book appointments, check doctor availability,
            and monitor your queue easily.
          </p>

          <button
            className="appointment-btn"
            onClick={() => setPage('login')}
          >
            Book an Appointment
          </button>

        </div>

      </section>

    </div>
  )
}

export default App