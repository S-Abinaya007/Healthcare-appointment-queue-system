function Login({ setPage, setCurrentUser }) {

  function handleLogin() {

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const role = document.getElementById('login-role').value

    if (!email || !password) {
      alert('Please enter email and password')
      return
    }


    // Patient Login

    if (role === 'Patient') {

      const patientData = localStorage.getItem(
        'patient_' + email
      )

      if (!patientData) {
        alert('Account not found. Please register first.')
        return
      }

      const patient = JSON.parse(patientData)

      if (patient.password !== password) {
        alert('Incorrect password')
        return
      }

      setCurrentUser(patient)

      setPage('patient')

      return
    }


    // Doctor Login

    if (role === 'Doctor') {

      const doctor = {
        name: 'Priya',
        email: email,
        specialization: 'General Medicine'
      }

      setCurrentUser(doctor)

      setPage('doctor')

      return
    }


    // Admin Login

    if (role === 'Admin') {

      alert('Admin dashboard will be added next.')

      return
    }

  }


  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Welcome Back</h1>

        <p>Login to your HealthCare account</p>


        <label>Email</label>

        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
        />


        <label>Password</label>

        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
        />


        <label>Login As</label>

        <select id="login-role">

          <option>Patient</option>

          <option>Doctor</option>

          <option>Admin</option>

        </select>


        <button
          className="login-submit"
          onClick={handleLogin}
        >
          Login
        </button>


        <p className="register-text">

          Don't have an account?

          <button
            className="register-link"
            onClick={() => setPage('register')}
          >
            Register
          </button>

        </p>

      </div>

    </div>
  )
}

export default Login