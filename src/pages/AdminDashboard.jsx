import { useState } from 'react'

function AdminDashboard({ setPage, currentUser }) {

  const [patients, setPatients] = useState([
    {
      id: 'PAT-001',
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      age: 25
    },
    {
      id: 'PAT-002',
      name: 'Anitha S',
      email: 'anitha@gmail.com',
      age: 30
    },
    {
      id: 'PAT-003',
      name: 'Karthik R',
      email: 'karthik@gmail.com',
      age: 28
    }
  ])

  const [doctors, setDoctors] = useState([
    {
      id: 'DOC-001',
      name: 'Dr. Priya',
      department: 'General Medicine',
      status: 'Available'
    },
    {
      id: 'DOC-002',
      name: 'Dr. Arun',
      department: 'Cardiology',
      status: 'Available'
    },
    {
      id: 'DOC-003',
      name: 'Dr. Meena',
      department: 'Dermatology',
      status: 'Unavailable'
    }
  ])

  const [appointments, setAppointments] = useState([
    {
      id: 'APT-001',
      patient: 'Rahul Kumar',
      doctor: 'Dr. Priya',
      date: '18/09/2026',
      time: '09:30 AM',
      status: 'Confirmed'
    },
    {
      id: 'APT-002',
      patient: 'Anitha S',
      doctor: 'Dr. Arun',
      date: '18/09/2026',
      time: '10:00 AM',
      status: 'Confirmed'
    }
  ])

  const [showPatients, setShowPatients] = useState(false)
  const [showDoctors, setShowDoctors] = useState(false)
  const [showAppointments, setShowAppointments] = useState(false)
  const [showQueues, setShowQueues] = useState(false)

  if (!currentUser) {
    return (
      <div className="login-page">

        <div className="login-box">

          <h1>No Admin Logged In</h1>

          <p>
            Please login to access the admin dashboard.
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


  function togglePatients() {
    setShowPatients(!showPatients)
    setShowDoctors(false)
    setShowAppointments(false)
    setShowQueues(false)
  }


  function toggleDoctors() {
    setShowDoctors(!showDoctors)
    setShowPatients(false)
    setShowAppointments(false)
    setShowQueues(false)
  }


  function toggleAppointments() {
    setShowAppointments(!showAppointments)
    setShowPatients(false)
    setShowDoctors(false)
    setShowQueues(false)
  }


  function toggleQueues() {
    setShowQueues(!showQueues)
    setShowPatients(false)
    setShowDoctors(false)
    setShowAppointments(false)
  }


  function removePatient(id) {

    const updatedPatients = patients.filter(
      (patient) => patient.id !== id
    )

    setPatients(updatedPatients)

    alert('Patient removed successfully')
  }


  function toggleDoctorStatus(id) {

    const updatedDoctors = doctors.map(
      (doctor) => {

        if (doctor.id === id) {

          return {
            ...doctor,
            status:
              doctor.status === 'Available'
                ? 'Unavailable'
                : 'Available'
          }

        }

        return doctor

      }
    )

    setDoctors(updatedDoctors)
  }


  function cancelAppointment(id) {

    const updatedAppointments = appointments.map(
      (appointment) => {

        if (appointment.id === id) {

          return {
            ...appointment,
            status: 'Cancelled'
          }

        }

        return appointment

      }
    )

    setAppointments(updatedAppointments)

    alert('Appointment cancelled')
  }


  return (
    <div className="dashboard">


      {/* Navbar */}

      <nav className="dashboard-navbar">

        <h2>HealthCare</h2>

        <div>

          <span>
            Admin
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* Dashboard Content */}

      <div className="dashboard-content">

        <h1>Admin Dashboard</h1>

        <p>
          Manage patients, doctors, appointments and queues.
        </p>


        {/* System Overview */}

        <div className="dashboard-section">

          <h2>System Overview</h2>

          <div className="queue-info">

            <div>

              <h3>
                Total Patients
              </h3>

              <span>
                {patients.length}
              </span>

            </div>


            <div>

              <h3>
                Total Doctors
              </h3>

              <span>
                {doctors.length}
              </span>

            </div>


            <div>

              <h3>
                Appointments
              </h3>

              <span>
                {appointments.length}
              </span>

            </div>


            <div>

              <h3>
                Active Queues
              </h3>

              <span>
                2
              </span>

            </div>

          </div>

        </div>


        {/* Quick Actions */}

        <div className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <button onClick={togglePatients}>
              Manage Patients
            </button>

            <button onClick={toggleDoctors}>
              Manage Doctors
            </button>

            <button onClick={toggleAppointments}>
              Manage Appointments
            </button>

            <button onClick={toggleQueues}>
              Monitor Queues
            </button>

            <button>
              Notifications
            </button>

          </div>

        </div>


        {/* Manage Patients */}

        {showPatients && (

          <div className="dashboard-section">

            <h2>Manage Patients</h2>

            {patients.map((patient) => (

              <div
                className="appointment-item"
                key={patient.id}
              >

                <div>

                  <strong>
                    {patient.name}
                  </strong>

                  <p>
                    Patient ID: {patient.id}
                  </p>

                  <p>
                    Email: {patient.email}
                  </p>

                  <p>
                    Age: {patient.age}
                  </p>

                </div>

                <button
                  onClick={() => removePatient(patient.id)}
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}


        {/* Manage Doctors */}

        {showDoctors && (

          <div className="dashboard-section">

            <h2>Manage Doctors</h2>

            {doctors.map((doctor) => (

              <div
                className="appointment-item"
                key={doctor.id}
              >

                <div>

                  <strong>
                    {doctor.name}
                  </strong>

                  <p>
                    Doctor ID: {doctor.id}
                  </p>

                  <p>
                    Department: {doctor.department}
                  </p>

                  <p>
                    Status: {doctor.status}
                  </p>

                </div>

                <button
                  onClick={() => toggleDoctorStatus(doctor.id)}
                >
                  {doctor.status === 'Available'
                    ? 'Set Unavailable'
                    : 'Set Available'}
                </button>

              </div>

            ))}

          </div>

        )}


        {/* Manage Appointments */}

        {showAppointments && (

          <div className="dashboard-section">

            <h2>Manage Appointments</h2>

            {appointments.map((appointment) => (

              <div
                className="appointment-item"
                key={appointment.id}
              >

                <div>

                  <strong>
                    {appointment.patient}
                  </strong>

                  <p>
                    Appointment ID: {appointment.id}
                  </p>

                  <p>
                    Doctor: {appointment.doctor}
                  </p>

                  <p>
                    Date: {appointment.date}
                  </p>

                  <p>
                    Time: {appointment.time}
                  </p>

                  <p>
                    Status: {appointment.status}
                  </p>

                </div>

                {appointment.status !== 'Cancelled' && (

                  <button
                    onClick={() =>
                      cancelAppointment(appointment.id)
                    }
                  >
                    Cancel
                  </button>

                )}

              </div>

            ))}

          </div>

        )}


        {/* Monitor Queues */}

        {showQueues && (

          <div className="queue-section">

            <h2>Monitor Queues</h2>

            <p>
              Monitor the current queue status of doctors.
            </p>


            <div className="queue-info">

              <div>

                <h3>
                  Dr. Priya
                </h3>

                <span>
                  Token 101
                </span>

              </div>


              <div>

                <h3>
                  Now Serving
                </h3>

                <span>
                  101
                </span>

              </div>


              <div>

                <h3>
                  Patients Waiting
                </h3>

                <span>
                  3
                </span>

              </div>


              <div>

                <h3>
                  Status
                </h3>

                <span>
                  Active
                </span>

              </div>

            </div>


            <br />


            <div className="queue-info">

              <div>

                <h3>
                  Dr. Arun
                </h3>

                <span>
                  Token 201
                </span>

              </div>


              <div>

                <h3>
                  Now Serving
                </h3>

                <span>
                  201
                </span>

              </div>


              <div>

                <h3>
                  Patients Waiting
                </h3>

                <span>
                  2
                </span>

              </div>


              <div>

                <h3>
                  Status
                </h3>

                <span>
                  Active
                </span>

              </div>

            </div>

          </div>

        )}


        {/* Departments */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Departments</h2>

            <p>
              Cardiology
            </p>

            <p>
              Dermatology
            </p>

            <p>
              General Medicine
            </p>

            <p>
              Orthopedics
            </p>

            <p>
              Pediatrics
            </p>

            <button>
              Manage Departments
            </button>

          </div>


          {/* Notifications */}

          <div className="dashboard-card">

            <h2>Notifications</h2>

            <p>
              2 new doctor availability updates.
            </p>

            <p>
              5 appointments scheduled today.
            </p>

            <p>
              Queue monitoring is active.
            </p>

            <button>
              View Notifications
            </button>

          </div>

        </div>


        {/* System Status */}

        <div className="dashboard-section">

          <h2>System Status</h2>

          <p>
            <strong>Backend:</strong> Development Mode
          </p>

          <p>
            <strong>Database:</strong> MongoDB
          </p>

          <p>
            <strong>API:</strong> REST API
          </p>

          <p>
            <strong>System:</strong> Operational
          </p>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard