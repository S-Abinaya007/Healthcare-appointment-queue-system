function Login({ setPage, setCurrentUser }) {

  async function handleLogin() {

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const role = document.getElementById('login-role').value

    if (!email || !password) {
      alert('Please enter email and password')
      return
    }


    // Patient Login

    if (role === 'Patient') {

      try {

        const response = await fetch('http://localhost:5000/api/patients/login', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        })

        const data = await response.json()

        if (response.ok) {

          alert('Login successful!')

          setCurrentUser(data.patient)

          setPage('patient')

        } else {

          alert(data.message)

        }

      } catch (error) {

        alert('Cannot connect to the server')

      }

      return
    }


    // Doctor Login

    if (role === 'Doctor') {

  try {

    const response = await fetch(
      'http://localhost:5000/api/doctors/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      }
    )

    const data = await response.json()

    if (response.ok) {

      alert('Doctor login successful!')

      setCurrentUser(data.doctor)

      setPage('doctor')

    } else {

      alert(data.message)

    }

  } catch (error) {

    alert('Cannot connect to the server')

  }

  return
}


    // Admin Login

    if (role === 'Admin') {

      const admin = {
        name: 'Admin',
        email: email
      }

      setCurrentUser(admin)

      setPage('admin')

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