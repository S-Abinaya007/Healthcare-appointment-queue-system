import { useState, useEffect } from 'react'

function PatientDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')

  const [department, setDepartment] = useState('')
  const [doctor, setDoctor] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [queueData, setQueueData] = useState({})

  useEffect(() => {
    async function getDoctors() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/doctors'
        )

        const data = await response.json()

        if (response.ok) {
          setDoctors(data)
        }
      } catch (error) {
        console.log('Failed to fetch doctors')
      }
    }

    getDoctors()
  }, [])

  useEffect(() => {
    async function getAppointments() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/appointments/${currentUser.email}`
        )

        const data = await response.json()

        if (response.ok) {
          setAppointments(data)
        }
      } catch (error) {
        console.log('Failed to fetch appointments')
      }
    }

    if (currentUser) {
      getAppointments()
    }
  }, [currentUser])

  useEffect(() => {
    async function getQueueData() {
      for (const appointment of appointments) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/appointments/queue/${appointment._id}`
          )

          const data = await response.json()

          if (response.ok) {
            setQueueData((previous) => ({
              ...previous,
              [appointment._id]: data
            }))
          }
        } catch (error) {
          console.log('Failed to fetch queue data')
        }
      }
    }

    if (appointments.length > 0) {
      getQueueData()
    }
  }, [appointments])

  function handleDoctorChange(e) {
    const selectedDoctorName = e.target.value

    setDoctor(selectedDoctorName)

    const selectedDoctor = doctors.find(
      (item) => item.name === selectedDoctorName
    )

    if (selectedDoctor) {
      setDoctorEmail(selectedDoctor.email)
    } else {
      setDoctorEmail('')
    }
  }

  async function handleBookAppointment(e) {
    e.preventDefault()

    if (
      !department ||
      !doctor ||
      !doctorEmail ||
      !date ||
      !time ||
      !reason
    ) {
      alert('Please select all appointment details')
      return
    }

    const newAppointment = {
      patientEmail: currentUser.email,
      patientName: currentUser.name,
      department: department,
      doctor: doctor,
      doctorName: doctor,
      doctorEmail: doctorEmail,
      date: date,
      time: time,
      reason: reason,
      status: 'Upcoming'
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/appointments/book',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAppointment)
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert('Appointment booked successfully!')

        setAppointments((previous) => [
          ...previous,
          data.appointment
        ])

        setDepartment('')
        setDoctor('')
        setDoctorEmail('')
        setDate('')
        setTime('')
        setReason('')
      } else {
        alert(data.message || 'Failed to book appointment')
      }
    } catch (error) {
      console.log(error)
      alert('Cannot connect to the server')
    }
  }

  const departmentDoctors = doctors.filter(
    (item) => item.specialization === department
  )

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Upcoming'
  )

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Completed'
  )

  const consultingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Consulting'
  )

  const notifications = []

  appointments.forEach((appointment) => {
    const queue = queueData[appointment._id]

    if (appointment.status === 'Completed') {
      notifications.push({
        id: `${appointment._id}-completed`,
        type: 'success',
        title: 'Consultation Completed',
        message: `Your consultation with ${appointment.doctorName || appointment.doctor || 'the doctor'} has been completed.`,
        date: appointment.date,
        time: appointment.time
      })
    }

    if (appointment.status === 'Consulting') {
      notifications.push({
        id: `${appointment._id}-called`,
        type: 'doctor',
        title: 'Your Token Has Been Called',
        message: `Please proceed for your consultation with ${appointment.doctorName || appointment.doctor || 'the doctor'}.`,
        date: appointment.date,
        time: appointment.time
      })
    }

    if (
      appointment.status === 'Upcoming' &&
      queue &&
      queue.patientsAhead <= 2 &&
      appointment.token
    ) {
      notifications.push({
        id: `${appointment._id}-queue`,
        type: 'queue',
        title: 'Your Token Is Approaching',
        message: `Your token is ${appointment.token}. There ${queue.patientsAhead === 1 ? 'is' : 'are'} ${queue.patientsAhead} patient${queue.patientsAhead === 1 ? '' : 's'} ahead of you.`,
        date: appointment.date,
        time: appointment.time
      })
    }

    if (
      appointment.status === 'Upcoming' &&
      (!queue || queue.patientsAhead > 2)
    ) {
      notifications.push({
        id: `${appointment._id}-appointment`,
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: `You have an appointment with ${appointment.doctorName || appointment.doctor || 'the doctor'} on ${appointment.date} at ${appointment.time}.`,
        date: appointment.date,
        time: appointment.time
      })
    }
  })

  return (
    <div className="patient-dashboard">

      <header className="dashboard-header">
        <div>
          <h1>Healthcare Appointment System</h1>
          <p>Patient Dashboard</p>
        </div>

        <div className="header-right">
          <span>Welcome, {currentUser.name}</span>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-layout">

        <aside className="sidebar">

          <button
            className={activeSection === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={activeSection === 'book' ? 'active' : ''}
            onClick={() => setActiveSection('book')}
          >
            Book Appointment
          </button>

          <button
            className={activeSection === 'appointments' ? 'active' : ''}
            onClick={() => setActiveSection('appointments')}
          >
            My Appointments
          </button>

          <button
            className={activeSection === 'queue' ? 'active' : ''}
            onClick={() => setActiveSection('queue')}
          >
            Live Queue
          </button>

          <button
            className={activeSection === 'history' ? 'active' : ''}
            onClick={() => setActiveSection('history')}
          >
            Medical History
          </button>

          <button
            className={activeSection === 'notifications' ? 'active' : ''}
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </button>

          <button
            className={activeSection === 'profile' ? 'active' : ''}
            onClick={() => setActiveSection('profile')}
          >
            My Profile
          </button>

        </aside>

        <main className="dashboard-content">

          {activeSection === 'dashboard' && (
            <section>

              <h2>Patient Dashboard</h2>

              <div className="quick-actions">

                <div
                  className="action-card"
                  onClick={() => setActiveSection('book')}
                >
                  <h3>Book Appointment</h3>
                  <p>Schedule a new appointment</p>
                </div>

                <div
                  className="action-card"
                  onClick={() => setActiveSection('appointments')}
                >
                  <h3>My Appointments</h3>
                  <p>View your appointments</p>
                </div>

                <div
                  className="action-card"
                  onClick={() => setActiveSection('queue')}
                >
                  <h3>Live Queue</h3>
                  <p>Check your current queue</p>
                </div>

              </div>

              <div className="dashboard-section">

                <h2>Upcoming Appointments</h2>

                {upcomingAppointments.length === 0 ? (
                  <p>No upcoming appointments.</p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div
                      className="appointment-card"
                      key={appointment._id}
                    >
                      <h3>
                        {appointment.department || 'Appointment'}
                      </h3>

                      <p>
                        Doctor: {appointment.doctorName || appointment.doctor || 'Not assigned'}
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

                      {appointment.reason && (
                        <p>
                          Reason: {appointment.reason}
                        </p>
                      )}

                    </div>
                  ))
                )}

              </div>

            </section>
          )}

          {activeSection === 'book' && (
            <section>

              <h2>Book Appointment</h2>

              <form
                className="appointment-form"
                onSubmit={handleBookAppointment}
              >

                <label>Department</label>

                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value)
                    setDoctor('')
                    setDoctorEmail('')
                  }}
                >
                  <option value="">
                    Select Department
                  </option>

                  <option value="General Medicine">
                    General Medicine
                  </option>

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Dermatology">
                    Dermatology
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                </select>

                <label>Doctor</label>

                <select
                  value={doctor}
                  onChange={handleDoctorChange}
                  disabled={!department}
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {departmentDoctors.map((item) => (
                    <option
                      key={item._id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}

                </select>

                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <label>Time</label>

                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">
                    Select Time
                  </option>

                  <option value="09:30 AM">
                    09:30 AM
                  </option>

                  <option value="10:30 AM">
                    10:30 AM
                  </option>

                  <option value="11:00 AM">
                    11:00 AM
                  </option>

                  <option value="11:30 AM">
                    11:30 AM
                  </option>

                  <option value="02:00 PM">
                    02:00 PM
                  </option>

                  <option value="03:00 PM">
                    03:00 PM
                  </option>

                  <option value="04:00 PM">
                    04:00 PM
                  </option>

                </select>

                <label>Reason for Visit</label>

                <input
                  type="text"
                  placeholder="Enter reason for appointment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <button type="submit">
                  Book Appointment
                </button>

              </form>

            </section>
          )}

          {activeSection === 'appointments' && (
            <section>

              <h2>My Appointments</h2>

              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                appointments.map((appointment) => (
                  <div
                    className="appointment-card"
                    key={appointment._id}
                  >

                    <h3>
                      {appointment.department || 'Appointment'}
                    </h3>

                    <p>
                      Doctor: {appointment.doctorName || appointment.doctor || 'Not assigned'}
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

                    {appointment.reason && (
                      <p>
                        Reason: {appointment.reason}
                      </p>
                    )}

                    {appointment.token && (
                      <p>
                        Token: {appointment.token}
                      </p>
                    )}

                  </div>
                ))
              )}

            </section>
          )}

          {activeSection === 'queue' && (
            <section>

              <h2>Live Queue</h2>

              {upcomingAppointments.length === 0 ? (
                <p>No active queue appointments.</p>
              ) : (
                upcomingAppointments.map((appointment) => {

                  const queue = queueData[appointment._id]

                  return (
                    <div
                      className="queue-card"
                      key={appointment._id}
                    >

                      <h3>
                        {appointment.doctorName || appointment.doctor || 'Doctor'}
                      </h3>

                      <p>
                        Department: {appointment.department || 'Not assigned'}
                      </p>

                      <p>
                        Your Token:{' '}
                        {appointment.token || 'Not assigned'}
                      </p>

                      {queue ? (
                        <>
                          <p>
                            Current Token:{' '}
                            {queue.currentToken || 'Not available'}
                          </p>

                          <p>
                            Patients Ahead:{' '}
                            {queue.patientsAhead}
                          </p>

                          <p>
                            Estimated Wait Time:{' '}
                            {queue.waitTime} minutes
                          </p>
                        </>
                      ) : (
                        <p>
                          Queue information loading...
                        </p>
                      )}

                    </div>
                  )
                })
              )}

            </section>
          )}

          {activeSection === 'history' && (
            <section>

              <h2>Medical History</h2>

              {completedAppointments.length === 0 ? (
                <p>No medical history available.</p>
              ) : (
                completedAppointments.map((appointment) => (
                  <div
                    className="appointment-card"
                    key={appointment._id}
                  >

                    <h3>
                      {appointment.department || 'Consultation'}
                    </h3>

                    <p>
                      Doctor: {appointment.doctorName || appointment.doctor || 'Not assigned'}
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

                    {appointment.reason && (
                      <p>
                        Reason: {appointment.reason}
                      </p>
                    )}

                  </div>
                ))
              )}

            </section>
          )}

          {activeSection === 'notifications' && (
            <section>

              <h2>Notifications</h2>

              {notifications.length === 0 ? (
                <div className="notification-card">
                  <h3>No New Notifications</h3>

                  <p>
                    You currently have no appointment or
                    queue notifications.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    className="notification-card"
                    key={notification.id}
                  >

                    <h3>
                      {notification.type === 'queue' && '🎟️ '}
                      {notification.type === 'doctor' && '👨‍⚕️ '}
                      {notification.type === 'success' && '✅ '}
                      {notification.type === 'appointment' && '📅 '}

                      {notification.title}
                    </h3>

                    <p>
                      {notification.message}
                    </p>

                    <small>
                      {notification.date} | {notification.time}
                    </small>

                  </div>
                ))
              )}

            </section>
          )}

          {activeSection === 'profile' && (
            <section>

              <h2>My Profile</h2>

              <div className="profile-card">

                <p>
                  <strong>Name:</strong>{' '}
                  {currentUser.name}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {currentUser.email}
                </p>

                {currentUser.age && (
                  <p>
                    <strong>Age:</strong>{' '}
                    {currentUser.age}
                  </p>
                )}

                {currentUser.gender && (
                  <p>
                    <strong>Gender:</strong>{' '}
                    {currentUser.gender}
                  </p>
                )}

              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  )
}

export default PatientDashboard