import { useState } from 'react'

function DoctorDashboard({ setPage, currentUser }) {

  const [available, setAvailable] = useState(true)

  const [queue, setQueue] = useState([
    {
      token: 101,
      patient: 'Rahul Kumar',
      status: 'Waiting'
    },
    {
      token: 102,
      patient: 'Anitha S',
      status: 'Waiting'
    },
    {
      token: 103,
      patient: 'Karthik R',
      status: 'Waiting'
    }
  ])

  const [currentPatient, setCurrentPatient] = useState(null)

  const [showHistory, setShowHistory] = useState(false)

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


  function callNextPatient() {

    if (queue.length === 0) {
      alert('No patients waiting')
      return
    }

    const nextPatient = queue[0]

    setCurrentPatient(nextPatient)

    const remainingPatients = queue.slice(1)

    setQueue(remainingPatients)
  }


  function completeConsultation() {

    if (!currentPatient) {
      alert('No patient is currently being consulted')
      return
    }

    alert(
      currentPatient.patient +
      "'s consultation completed."
    )

    setCurrentPatient(null)
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
            Dr. {currentUser.name}
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
                Dr. {currentUser.name}
              </p>

              <p>
                <strong>Doctor ID:</strong> DOC-001
              </p>

            </div>


            <div>

              <p>
                <strong>Specialization:</strong>{' '}
                General Medicine
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

          <div className="appointment-list">

            <div className="appointment-item">

              <div>

                <strong>
                  Rahul Kumar
                </strong>

                <p>
                  09:30 AM
                </p>

              </div>

              <span>
                Upcoming
              </span>

              <button>
                View
              </button>

            </div>


            <div className="appointment-item">

              <div>

                <strong>
                  Anitha S
                </strong>

                <p>
                  10:00 AM
                </p>

              </div>

              <span>
                Upcoming
              </span>

              <button>
                View
              </button>

            </div>


            <div className="appointment-item">

              <div>

                <strong>
                  Karthik R
                </strong>

                <p>
                  11:00 AM
                </p>

              </div>

              <span>
                Upcoming
              </span>

              <button>
                View
              </button>

            </div>

          </div>

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
                  : 'Available'}
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

              <p key={patient.token}>

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

            <div>

              <h3>
                Rahul Kumar
              </h3>

              <p>
                Previous Visit: 10/09/2026
              </p>

              <p>
                Diagnosis: Common Cold
              </p>

              <p>
                Notes: Patient advised rest and medication.
              </p>

            </div>


            <hr />


            <div>

              <h3>
                Anitha S
              </h3>

              <p>
                Previous Visit: 05/09/2026
              </p>

              <p>
                Diagnosis: Migraine
              </p>

              <p>
                Notes: Follow-up recommended.
              </p>

            </div>

          </div>

        )}


        {/* Notifications */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Notifications</h2>

            <p>
              3 patients have appointments today.
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
              3
            </p>

            <p>
              <strong>
                Patients Completed:
              </strong>{' '}
              0
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