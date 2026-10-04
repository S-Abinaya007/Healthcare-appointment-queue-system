import { useState, useEffect } from 'react'

function AdminDashboard({ setPage, currentUser }) {

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])

  const [doctorName, setDoctorName] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctorSpecialization, setDoctorSpecialization] = useState('')

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

  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
      .then(response => response.json())
      .then(data => {
        setPatients(data)
      })
      .catch(error => {
        console.log('Error fetching patients:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then(response => response.json())
      .then(data => {
        setDoctors(data)
      })
      .catch(error => {
        console.log('Error fetching doctors:', error)
      })
  }, [])

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

  async function removePatient(id) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        return
      }

      const updatedPatients = patients.filter(
        (patient) => patient._id !== id
      )

      setPatients(updatedPatients)

      alert('Patient removed successfully')
    } catch (error) {
      console.log('Error removing patient:', error)
      alert('Failed to remove patient')
    }
  }

  async function createDoctor(event) {
    event.preventDefault()

    if (!doctorName || !doctorEmail || !doctorSpecialization) {
      alert('Please fill all doctor details')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/doctors/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: doctorName,
            email: doctorEmail,
            specialization: doctorSpecialization,
            status: 'Available'
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        return
      }

      setDoctors([...doctors, data.doctor])

      setDoctorName('')
      setDoctorEmail('')
      setDoctorSpecialization('')

      alert('Doctor created successfully')
    } catch (error) {
      console.log('Error creating doctor:', error)
      alert('Failed to create doctor')
    }
  }

  function toggleDoctorStatus(id) {

    const updatedDoctors = doctors.map(
      (doctor) => {

        if (doctor._id === id) {

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

      <div className="dashboard-content">

        <h1>Admin Dashboard</h1>

        <p>
          Manage patients, doctors, appointments and queues.
        </p>

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

        {showPatients && (

          <div className="dashboard-section">

            <h2>Manage Patients</h2>

            {patients.map((patient) => (

              <div
                className="appointment-item"
                key={patient._id || patient.id}
              >

                <div>

                  <strong>
                    {patient.name}
                  </strong>

                  <p>
                    Patient ID: {patient._id || patient.id}
                  </p>

                  <p>
                    Email: {patient.email}
                  </p>

                  <p>
                    Age: {patient.age}
                  </p>

                </div>

                <button
                  onClick={() =>
                    removePatient(patient._id || patient.id)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}

        {showDoctors && (

          <div className="dashboard-section">

            <h2>Manage Doctors</h2>

            <div className="dashboard-card">

              <h2>Add New Doctor</h2>

              <form onSubmit={createDoctor}>

                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={doctorName}
                  onChange={(event) =>
                    setDoctorName(event.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Doctor Email"
                  value={doctorEmail}
                  onChange={(event) =>
                    setDoctorEmail(event.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Specialization"
                  value={doctorSpecialization}
                  onChange={(event) =>
                    setDoctorSpecialization(event.target.value)
                  }
                />

                <button type="submit">
                  Create Doctor
                </button>

              </form>

            </div>

            <br />

            <h2>Doctors</h2>

            {doctors.map((doctor) => (

              <div
                className="appointment-item"
                key={doctor._id}
              >

                <div>

                  <strong>
                    {doctor.name}
                  </strong>

                  <p>
                    Doctor ID: {doctor._id}
                  </p>

                  <p>
                    Email: {doctor.email}
                  </p>

                  <p>
                    Department: {doctor.specialization}
                  </p>

                  <p>
                    Status: {doctor.status || 'Available'}
                  </p>

                </div>

                <button
                  onClick={() =>
                    toggleDoctorStatus(doctor._id)
                  }
                >
                  {(doctor.status || 'Available') === 'Available'
                    ? 'Set Unavailable'
                    : 'Set Available'}
                </button>

              </div>

            ))}

          </div>

        )}

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