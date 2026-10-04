import { useState, useEffect } from 'react'

function DoctorDashboard({ setPage, currentUser }) {

  const [available, setAvailable] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [queue, setQueue] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

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

        } else {

          console.log(
            'Failed to fetch appointments:',
            data.message
          )

        }

      } catch (error) {

        console.log(
          'Failed to fetch doctor appointments:',
          error
        )

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

        setAppointments(
          appointments.map((appointment) =>
            appointment._id === nextPatient.appointmentId
              ? {
                  ...appointment,
                  status: 'Consulting'
                }
              : appointment
          )
        )

        alert('Patient called successfully')

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.log(error)

      alert('Cannot connect to server')

    }

  }


  async function completeConsultation() {

    if (!currentPatient) {

      alert(
        'No patient is currently being consulted'
      )

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

        setAppointments(
          appointments.map((appointment) =>
            appointment._id === currentPatient.appointmentId
              ? {
                  ...appointment,
                  status: 'Completed'
                }
              : appointment
          )
        )

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.log(error)

      alert('Cannot connect to server')

    }

  }


  function toggleAvailability() {

    setAvailable(!available)

  }


  function scrollToSection(id) {

    const element = document.getElementById(id)

    if (element) {

      element.scrollIntoView({
        behavior: 'smooth'
      })

    }

  }


  function openPatientHistory() {

    setShowHistory(true)

    setTimeout(() => {

      scrollToSection('patient-history')

    }, 100)

  }


  return (
    <div className="dashboard">

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


      <div className="dashboard-content">

        <h1>Doctor Dashboard</h1>

        <p>
          Manage your appointments, patients and live queue.
        </p>


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


        <div className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <button
              onClick={() =>
                scrollToSection('today-appointments')
              }
            >
              Today's Appointments
            </button>


            <button
              onClick={() =>
                scrollToSection('live-queue')
              }
            >
              Manage Queue
            </button>


            <button
              onClick={openPatientHistory}
            >
              Patient History
            </button>


            <button
              onClick={toggleAvailability}
            >
              Update Availability
            </button>


            <button
              onClick={() =>
                scrollToSection('notifications')
              }
            >
              Notifications
            </button>

          </div>

        </div>


        <div
          className="dashboard-section"
          id="today-appointments"
        >

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

                    <p>
                      {appointment.date}
                    </p>

                    <p>
                      {appointment.department}
                    </p>

                    {appointment.reason && (
                      <p>
                        Reason: {appointment.reason}
                      </p>
                    )}

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


        <div
          className="queue-section"
          id="live-queue"
        >

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

                Token {patient.token || '—'} -{' '}
                {patient.patient}

              </p>

            ))

          )}

        </div>


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


        {showHistory && (

          <div
            className="dashboard-section"
            id="patient-history"
          >

            <h2>Patient History</h2>

            {appointments.length === 0 ? (

              <p>
                No patient history available.
              </p>

            ) : (

              <div className="appointment-list">

                {appointments.map((appointment) => (

                  <div
                    className="appointment-item"
                    key={`history-${appointment._id}`}
                  >

                    <div>

                      <strong>
                        {appointment.patientName}
                      </strong>

                      <p>
                        Date: {appointment.date}
                      </p>

                      <p>
                        Time: {appointment.time}
                      </p>

                      <p>
                        Department: {appointment.department}
                      </p>

                      <p>
                        Doctor: {appointment.doctor}
                      </p>

                      {appointment.reason && (
                        <p>
                          Reason: {appointment.reason}
                        </p>
                      )}

                    </div>

                    <span>
                      {appointment.status}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}


        <div
          className="dashboard-grid"
          id="notifications"
        >

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