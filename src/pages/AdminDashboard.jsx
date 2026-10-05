import { useState, useEffect } from 'react'

function AdminDashboard({ setPage, currentUser }) {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [queueData, setQueueData] = useState({})

  const [doctorName, setDoctorName] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctorSpecialization, setDoctorSpecialization] = useState('')

  const [showPatients, setShowPatients] = useState(false)
  const [showDoctors, setShowDoctors] = useState(false)
  const [showAppointments, setShowAppointments] = useState(false)
  const [showQueues, setShowQueues] = useState(false)

  useEffect(() => {
    async function getData() {
      try {
        const patientResponse = await fetch(
          'http://localhost:5000/api/patients'
        )

        const patientData = await patientResponse.json()

        if (patientResponse.ok) {
          setPatients(patientData)
        }

        const doctorResponse = await fetch(
          'http://localhost:5000/api/doctors'
        )

        const doctorData = await doctorResponse.json()

        if (doctorResponse.ok) {
          setDoctors(doctorData)
        }

        const appointmentResponse = await fetch(
          'http://localhost:5000/api/appointments'
        )

        const appointmentData = await appointmentResponse.json()

        if (appointmentResponse.ok) {
          setAppointments(appointmentData)

          const updatedQueueData = {}

          for (const appointment of appointmentData) {
            try {
              const queueResponse = await fetch(
                `http://localhost:5000/api/appointments/queue/${appointment._id}`
              )

              const queue = await queueResponse.json()

              if (queueResponse.ok) {
                updatedQueueData[appointment._id] = queue
              }
            } catch (error) {
              console.log('Error fetching queue:', error)
            }
          }

          setQueueData(updatedQueueData)
        }
      } catch (error) {
        console.log('Error fetching admin data:', error)
      }
    }

    getData()

    const interval = setInterval(getData, 5000)

    return () => clearInterval(interval)
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
        patient => patient._id !== id
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
    const updatedDoctors = doctors.map(doctor => {
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
    })

    setDoctors(updatedDoctors)
  }

  const activeAppointments = appointments.filter(
    appointment =>
      appointment.status === 'Upcoming' ||
      appointment.status === 'Consulting'
  )

  const activeQueues = new Set(
    activeAppointments.map(
      appointment =>
        `${appointment.doctorName}-${appointment.date}`
    )
  )

  return (
    <div className="dashboard">

      <nav className="dashboard-navbar">

        <h2>HealthCare</h2>

        <div>
          <span>Admin</span>

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
              <h3>Total Patients</h3>
              <span>{patients.length}</span>
            </div>

            <div>
              <h3>Total Doctors</h3>
              <span>{doctors.length}</span>
            </div>

            <div>
              <h3>Appointments</h3>
              <span>{appointments.length}</span>
            </div>

            <div>
              <h3>Active Queues</h3>
              <span>{activeQueues.size}</span>
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

            {patients.length === 0 ? (
              <p>No patients registered.</p>
            ) : (
              patients.map(patient => (
                <div
                  className="appointment-item"
                  key={patient._id}
                >

                  <div>

                    <strong>
                      {patient.name}
                    </strong>

                    <p>
                      Patient ID: {patient._id}
                    </p>

                    <p>
                      Email: {patient.email}
                    </p>

                    <p>
                      Age: {patient.age}
                    </p>

                    <p>
                      Gender: {patient.gender}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removePatient(patient._id)
                    }
                  >
                    Remove
                  </button>

                </div>
              ))
            )}

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
                  onChange={event =>
                    setDoctorName(event.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Doctor Email"
                  value={doctorEmail}
                  onChange={event =>
                    setDoctorEmail(event.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Specialization"
                  value={doctorSpecialization}
                  onChange={event =>
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

            {doctors.length === 0 ? (
              <p>No doctors registered.</p>
            ) : (
              doctors.map(doctor => (
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
              ))
            )}

          </div>
        )}

        {showAppointments && (
          <div className="dashboard-section">

            <h2>Manage Appointments</h2>

            {appointments.length === 0 ? (
              <p>No appointments available.</p>
            ) : (
              appointments.map(appointment => (
                <div
                  className="appointment-item"
                  key={appointment._id}
                >

                  <div>

                    <strong>
                      {appointment.patientName}
                    </strong>

                    <p>
                      Appointment ID: {appointment._id}
                    </p>

                    <p>
                      Patient Email: {appointment.patientEmail}
                    </p>

                    <p>
                      Doctor: {appointment.doctorName}
                    </p>

                    <p>
                      Department: {appointment.department}
                    </p>

                    <p>
                      Date: {appointment.date}
                    </p>

                    <p>
                      Time: {appointment.time}
                    </p>

                    <p>
                      Token: {appointment.token || 'Not assigned'}
                    </p>

                    <p>
                      Status: {appointment.status}
                    </p>

                  </div>

                </div>
              ))
            )}

          </div>
        )}

        {showQueues && (
          <div className="queue-section">

            <h2>Monitor Queues</h2>

            <p>
              Monitor the current queue status of doctors.
            </p>

            {doctors.length === 0 ? (
              <p>No doctors available.</p>
            ) : (
              doctors.map(doctor => {

                const doctorAppointments = activeAppointments.filter(
                  appointment =>
                    appointment.doctorName === doctor.name
                )

                const doctorQueue =
                  doctorAppointments.length > 0
                    ? queueData[doctorAppointments[0]._id]
                    : null

                return (
                  <div
                    className="queue-info"
                    key={doctor._id}
                  >

                    <div>
                      <h3>{doctor.name}</h3>
                      <span>
                        {doctor.specialization}
                      </span>
                    </div>

                    <div>
                      <h3>Status</h3>
                      <span>
                        {doctor.status || 'Available'}
                      </span>
                    </div>

                    <div>
                      <h3>Queue</h3>

                      {doctorQueue ? (
                        <span>
                          Current Token: {doctorQueue.currentToken || 'None'}
                          <br />
                          Patients Ahead: {doctorQueue.patientsAhead}
                          <br />
                          Wait Time: {doctorQueue.waitTime} minutes
                        </span>
                      ) : (
                        <span>
                          No active queue
                        </span>
                      )}

                    </div>

                  </div>
                )
              })
            )}

          </div>
        )}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Departments</h2>

            <p>Cardiology</p>
            <p>Dermatology</p>
            <p>General Medicine</p>
            <p>Orthopedics</p>
            <p>Pediatrics</p>

            <button>
              Manage Departments
            </button>

          </div>

          <div className="dashboard-card">

            <h2>Notifications</h2>

            <p>
              Doctor availability is updated from the database.
            </p>

            <p>
              Appointment data is loaded from MongoDB.
            </p>

            <p>
              Queue information is calculated from active appointments.
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