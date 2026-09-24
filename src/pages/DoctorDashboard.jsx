import { useState, useEffect } from 'react'

function DoctorDashboard({ setPage, currentUser }) {

  const [available, setAvailable] = useState(true)

  const [appointments, setAppointments] = useState([])

  const [queue, setQueue] = useState([])

  const [currentPatient, setCurrentPatient] = useState(null)

  const [showHistory, setShowHistory] = useState(false)


  // Get doctor's appointments from MongoDB

  useEffect(() => {

    async function getAppointments() {

      try {

        const response = await fetch(
          `http://localhost:5000/api/appointments/doctor/${encodeURIComponent(currentUser.name)}`
        )

        const data = await response.json()

        if (response.ok) {

          setAppointments(data)

          const waitingPatients = data
            .filter(
              (appointment) =>
                appointment.status === 'Upcoming'
            )
            .map((appointment) => ({
              token: appointment.token,
              patient: appointment.patientName,
              appointmentId: appointment._id,
              status: 'Waiting'
            }))

          setQueue(waitingPatients)

        }

      } catch (error) {

        console.log('Failed to fetch doctor appointments')

      }

    }

    if (currentUser) {
      getAppointments()
    }

  }, [currentUser])


  if (!currentUser) {

    return (
      <div className="login-page">

        <div className="login-box">

          <h1>No Doctor Logged In</h1>

          <p>
            Please login to access your dashboard.
          </p>

          <button
            className="login-submit"
            onClick={() => setPage('login')}
          >
            Go to Login
          </button>

        </div>

      </div>
    )
  }


  function handleLogout() {
    setPage('login')
  }


  async function callNextPatient() {

  if (queue.length === 0) {

    alert('No patients waiting')

    return

  }

  const nextPatient = queue[0]

  try {

    const response = await fetch(
      `http://localhost:5000/api/appointments/call/${nextPatient.appointmentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (response.ok) {

      setCurrentPatient({
        ...nextPatient,
        status: 'Consulting'
      })

      setQueue(queue.slice(1))

      alert('Patient called successfully')

    } else {

      alert(data.message)

    }

  } catch (error) {

    alert('Cannot connect to server')

  }

}


  async function completeConsultation() {

  if (!currentPatient) {

    alert('No patient is currently being consulted')

    return

  }

  try {

    const response = await fetch(
      `http://localhost:5000/api/appointments/complete/${currentPatient.appointmentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (response.ok) {

      alert(
        currentPatient.patient +
        "'s consultation completed."
      )

      setCurrentPatient(null)

      // Remove completed appointment from the appointment list
      setAppointments(
        appointments.filter(
          (appointment) =>
            appointment._id !== currentPatient.appointmentId
        )
      )

    } else {

      alert(data.message)

    }

  } catch (error) {

    alert('Cannot connect to server')

  }

}

  function toggleAvailability() {

    setAvailable(!available)

  }


  return (
    <div className="dashboard">


      {/* Navbar */}

      <nav className="dashboard-navbar">

        <h2>HealthCare</h2>

        <div>

          <span>
            {currentUser.name}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* Dashboard Content */}

      <div className="dashboard-content">

        <h1>Doctor Dashboard</h1>

        <p>
          Manage your appointments, patients and live queue.
        </p>


        {/* Doctor Profile */}

        <div className="dashboard-section">

          <h2>My Profile</h2>

          <div className="profile-info">

            <div>

              <p>
                <strong>Doctor Name:</strong>{' '}
                {currentUser.name}
              </p>

              <p>
                <strong>Doctor ID:</strong> DOC-001
              </p>

            </div>


            <div>

              <p>
                <strong>Specialization:</strong>{' '}
                {currentUser.specialization}
              </p>

              <p>
                <strong>Experience:</strong> 5 Years
              </p>

            </div>


            <div>

              <p>
                <strong>Email:</strong>{' '}
                {currentUser.email}
              </p>

              <p>
                <strong>Contact:</strong> —
              </p>

            </div>

          </div>


          <button className="secondary-btn">
            Edit Profile
          </button>

        </div>


        {/* Quick Actions */}

        <div className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <button>
              Today's Appointments
            </button>

            <button>
              Manage Queue
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
            >
              Patient History
            </button>

            <button
              onClick={toggleAvailability}
            >
              Update Availability
            </button>

            <button>
              Notifications
            </button>

          </div>

        </div>


        {/* Today's Appointments */}

        <div className="dashboard-section">

          <h2>Today's Appointments</h2>

          {appointments.length === 0 ? (

            <p>
              No appointments found.
            </p>

          ) : (

            <div className="appointment-list">

              {appointments.map((appointment) => (

                <div
                  className="appointment-item"
                  key={appointment._id}
                >

                  <div>

                    <strong>
                      {appointment.patientName}
                    </strong>

                    <p>
                      {appointment.time}
                    </p>

                  </div>

                  <span>
                    {appointment.status}
                  </span>

                  <button>
                    View
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Live Queue */}

        <div className="queue-section">

          <h2>Live Patient Queue</h2>

          <p>
            Manage patients waiting for consultation.
          </p>


          <div className="queue-info">

            <div>

              <h3>
                Current Token
              </h3>

              <span>
                {currentPatient
                  ? currentPatient.token
                  : '—'}
              </span>

            </div>


            <div>

              <h3>
                Current Patient
              </h3>

              <span>
                {currentPatient
                  ? currentPatient.patient
                  : '—'}
              </span>

            </div>


            <div>

              <h3>
                Patients Waiting
              </h3>

              <span>
                {queue.length}
              </span>

            </div>


            <div>

              <h3>
                Status
              </h3>

              <span>
                {currentPatient
                  ? 'Consulting'
                  : available
                    ? 'Available'
                    : 'Unavailable'}
              </span>

            </div>

          </div>


          <br />


          <button
            className="login-submit"
            onClick={callNextPatient}
          >
            Call Next Patient
          </button>


          <button
            className="secondary-btn"
            onClick={completeConsultation}
          >
            Complete Consultation
          </button>


          {/* Waiting Patients */}

          <h3>
            Waiting Patients
          </h3>


          {queue.length === 0 ? (

            <p>
              No patients waiting.
            </p>

          ) : (

            queue.map((patient) => (

              <p key={patient.appointmentId}>

                Token {patient.token} -{' '}
                {patient.patient}

              </p>

            ))

          )}

        </div>


        {/* Availability */}

        <div className="dashboard-section">

          <h2>Doctor Availability</h2>

          <p>

            Current Status:{' '}

            <strong>
              {available
                ? 'Available'
                : 'Unavailable'}
            </strong>

          </p>


          <p>
            Working Hours: 09:00 AM - 05:00 PM
          </p>


          <button
            className="login-submit"
            onClick={toggleAvailability}
          >

            {available
              ? 'Set Unavailable'
              : 'Set Available'}

          </button>

        </div>


        {/* Patient History */}

        {showHistory && (

          <div className="dashboard-section">

            <h2>Patient History</h2>

            <p>
              Patient history will be connected to MongoDB later.
            </p>

          </div>

        )}


        {/* Notifications */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Notifications</h2>

            <p>
              {appointments.length} patients have appointments.
            </p>

            <p>
              Queue has been updated.
            </p>

            <p>
              Your schedule is active.
            </p>

            <button>
              View Notifications
            </button>

          </div>


          {/* Consultation Summary */}

          <div className="dashboard-card">

            <h2>Today's Summary</h2>

            <p>

              <strong>
                Total Appointments:
              </strong>{' '}

              {appointments.length}

            </p>


            <p>

              <strong>
                Patients Completed:
              </strong>{' '}

              {appointments.filter(
                (appointment) =>
                  appointment.status === 'Completed'
              ).length}

            </p>


            <p>

              <strong>
                Patients Waiting:
              </strong>{' '}

              {queue.length}

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default DoctorDashboard