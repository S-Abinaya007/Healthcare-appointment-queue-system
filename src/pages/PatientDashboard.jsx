import { useState } from 'react'

function PatientDashboard({ setPage, currentUser }) {

  const [showBooking, setShowBooking] = useState(false)

  const [department, setDepartment] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [appointment, setAppointment] = useState(null)

  if (!currentUser) {
    return (
      <div className="login-page">

        <div className="login-box">

          <h1>No User Logged In</h1>

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

  function handleBookAppointment() {

    if (!department || !doctor || !date || !time) {
      alert('Please select all appointment details')
      return
    }

    const newAppointment = {
      department: department,
      doctor: doctor,
      date: date,
      time: time,
      status: 'Upcoming'
    }

    setAppointment(newAppointment)

    setShowBooking(false)

    alert('Appointment booked successfully!')
  }

  return (
    <div className="dashboard">

      {/* Navbar */}

      <nav className="dashboard-navbar">

        <h2>HealthCare</h2>

        <div>

          <span>
            Hi, {currentUser.name}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* Dashboard Content */}

      <div className="dashboard-content">

        <h1>Patient Dashboard</h1>

        <p>
          Manage your appointments, queue status and medical information.
        </p>


        {/* Profile */}

        <div className="dashboard-section">

          <h2>My Profile</h2>

          <div className="profile-info">

            <div>

              <p>
                <strong>Patient Name:</strong>{' '}
                {currentUser.name}
              </p>

              <p>
                <strong>Patient ID:</strong> —
              </p>

            </div>

            <div>

              <p>
                <strong>Age:</strong>{' '}
                {currentUser.age}
              </p>

              <p>
                <strong>Gender:</strong>{' '}
                {currentUser.gender}
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

            <button onClick={() => setShowBooking(true)}>
              Book Appointment
            </button>

            <button>
              My Appointments
            </button>

            <button>
              Live Queue
            </button>

            <button>
              Medical History
            </button>

            <button>
              Notifications
            </button>

          </div>

        </div>


        {/* Booking Form */}

        {showBooking && (

          <div className="dashboard-section">

            <h2>Book Appointment</h2>

            <p>
              Select a department, doctor, date and time.
            </p>


            {/* Department */}

            <label>Department</label>

            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setDoctor('')
              }}
            >

              <option value="">
                Select Department
              </option>

              <option value="Cardiology">
                Cardiology
              </option>

              <option value="Dermatology">
                Dermatology
              </option>

              <option value="General Medicine">
                General Medicine
              </option>

              <option value="Orthopedics">
                Orthopedics
              </option>

              <option value="Pediatrics">
                Pediatrics
              </option>

            </select>


            {/* Doctor */}

            <label>Doctor</label>

            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            >

              <option value="">
                Select Doctor
              </option>

              {department === 'Cardiology' && (
                <>
                  <option>Dr. Priya</option>
                  <option>Dr. Arun</option>
                </>
              )}

              {department === 'Dermatology' && (
                <>
                  <option>Dr. Meena</option>
                  <option>Dr. Karthik</option>
                </>
              )}

              {department === 'General Medicine' && (
                <>
                  <option>Dr. Rahul</option>
                  <option>Dr. Divya</option>
                </>
              )}

              {department === 'Orthopedics' && (
                <>
                  <option>Dr. Suresh</option>
                  <option>Dr. Anitha</option>
                </>
              )}

              {department === 'Pediatrics' && (
                <>
                  <option>Dr. Kavya</option>
                  <option>Dr. Sanjay</option>
                </>
              )}

            </select>


            {/* Date */}

            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />


            {/* Time */}

            <label>Time</label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >

              <option value="">
                Select Time
              </option>

              <option>09:00 AM</option>
              <option>09:30 AM</option>
              <option>10:00 AM</option>
              <option>10:30 AM</option>
              <option>11:00 AM</option>
              <option>11:30 AM</option>
              <option>02:00 PM</option>
              <option>02:30 PM</option>
              <option>03:00 PM</option>
              <option>03:30 PM</option>
              <option>04:00 PM</option>

            </select>


            <br />
            <br />

            <button
              className="login-submit"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>


            <button
              className="secondary-btn"
              onClick={() => setShowBooking(false)}
            >
              Cancel
            </button>

          </div>

        )}


        {/* Appointment Cards */}

        <div className="dashboard-grid">

          {/* Book Appointment Card */}

          <div className="dashboard-card">

            <h2>Book Appointment</h2>

            <p>
              Select a department, doctor, date and time
              to book an appointment.
            </p>

            <button
              onClick={() => setShowBooking(true)}
            >
              Book Now
            </button>

          </div>


          {/* Upcoming Appointment */}

          <div className="dashboard-card">

            <h2>Upcoming Appointment</h2>

            {appointment ? (

              <div>

                <p>
                  <strong>Doctor:</strong>{' '}
                  {appointment.doctor}
                </p>

                <p>
                  <strong>Department:</strong>{' '}
                  {appointment.department}
                </p>

                <p>
                  <strong>Date:</strong>{' '}
                  {appointment.date}
                </p>

                <p>
                  <strong>Time:</strong>{' '}
                  {appointment.time}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {appointment.status}
                </p>

              </div>

            ) : (

              <p>
                No upcoming appointments.
              </p>

            )}

            <button
              onClick={() => setShowBooking(true)}
            >
              Book Appointment
            </button>

          </div>

        </div>


        {/* Live Queue */}

        <div className="queue-section">

          <h2>Live Queue Status</h2>

          <p>
            No active queue.
          </p>

          <div className="queue-info">

            <div>
              <h3>Your Token</h3>
              <span>—</span>
            </div>

            <div>
              <h3>Now Serving</h3>
              <span>—</span>
            </div>

            <div>
              <h3>Patients Ahead</h3>
              <span>—</span>
            </div>

            <div>
              <h3>Estimated Wait</h3>
              <span>—</span>
            </div>

          </div>

        </div>


        {/* My Appointments */}

        <div className="dashboard-section">

          <h2>My Appointments</h2>

          {appointment ? (

            <div>

              <p>
                <strong>Doctor:</strong>{' '}
                {appointment.doctor}
              </p>

              <p>
                <strong>Department:</strong>{' '}
                {appointment.department}
              </p>

              <p>
                <strong>Date:</strong>{' '}
                {appointment.date}
              </p>

              <p>
                <strong>Time:</strong>{' '}
                {appointment.time}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {appointment.status}
              </p>

            </div>

          ) : (

            <p>
              No appointments yet.
            </p>

          )}

        </div>


        {/* History + Notifications */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Medical History</h2>

            <p>
              No medical history available.
            </p>

            <button>
              View History
            </button>

          </div>


          <div className="dashboard-card">

            <h2>Notifications</h2>

            <p>
              No new notifications.
            </p>

            <button>
              View Notifications
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default PatientDashboard