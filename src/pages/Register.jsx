import { useState } from 'react'

function Register({ setPage }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')

  function handleRegister() {

    if (!name || !email || !password || !age || !gender) {
      alert('Please fill all the fields')
      return
    }

    const patient = {
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender
    }

    localStorage.setItem(
      'patient_' + email,
      JSON.stringify(patient)
    )

    alert('Registration successful!')

    setPage('login')
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Create Account</h1>

        <p>Register for your HealthCare account</p>

        <label>Full Name</label>

        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Age</label>

        <input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label>Gender</label>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <button
          className="login-submit"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="register-text">

          Already have an account?

          <button
            className="register-link"
            onClick={() => setPage('login')}
          >
            Login
          </button>

        </p>

      </div>

    </div>
  )
}

export default Register