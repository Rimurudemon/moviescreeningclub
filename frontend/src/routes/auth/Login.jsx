import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { api } from '@/utils/api'
import { useMembershipContext } from '@/components/MembershipContext'
import imageOne from '@/images/home_cinema.svg'
import { useLogin } from '@/components/LoginContext'
import Swal from 'sweetalert2'

const Login = () => {
  const { login, user } = useLogin()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from ?? { pathname: '/home', search: '' }

  const signupEmail = location.state?.email

  const [formData, setFormData] = useState({
    email: signupEmail ?? '',
    password: ''
  })
  const { hasMembership, checkMembershipStatus } = useMembershipContext()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(from.pathname + from.search)
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/auth/login`, formData)
      if (res.status === 200) {
        const membershipResponse = await api.get('/membership/check', {
          headers: {
            Authorization: `Bearer ${res.data.token}`
          }
        })
        checkMembershipStatus(membershipResponse.data)
        console.log('membershipResponse', membershipResponse.data)
        login(res.data.token)
      }
    } catch (err) {
      if (err.res.status === 404) {
        Swal.fire({ title: 'Error', text: 'User not found', icon: 'error' })
      } else if (err.res.status === 401) {
        Swal.fire({
          title: 'Error',
          text: 'Email or password is wrong',
          icon: 'error'
        })
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Internal server error',
          icon: 'error'
        })
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#e5e8f0] font-monts">
      <div className="flex items-center justify-center flex-wrap w-[80%] md:h-[90%] sm:h-[90%] max-sm:h-[60%] max-sm:w-[90%] bg-white rounded-3xl ">
        <div className="flex w-[99.5%] h-[99%] bg-gradient-to-r from-white to-gray-100 rounded-3xl">
          <div className="w-[50%] h-full flex justify-center items-center max-sm:hidden">
            <div className="w-[98%] h-[98%] rounded-2xl flex justify-center items-center bg-[#da9afe]">
              <img
                src={imageOne}
                className="h-2/3 w-2/3 rounded-2xl"
                alt="Login"
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-4 w-1/2 max-sm:w-full">
            <div className="flex flex-col justify-center gap-6 h-full w-[90%]">
              <div className="h-[20%]">
                <p className="text-center font-bold text-3xl max-sm:text-xl">
                  Welcome Again!
                </p>
                <p className="text-center font-normal text-2xl mt-4 max-sm:text-medium">
                  Please login to continue
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-3 h-[60%] max-sm:text-sm"
              >
                <div className="flex justify-center text-lg h-[15%] w-[82%] border rounded-2xl">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      strokeOpacity={0.5}
                      className="w-8 h-8 mx-2 max-sm:w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border w-full rounded-2xl text-center max-sm:text-sm "
                    placeholder="enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-center text-lg h-[15%] w-[82%] border rounded-2xl">
                  <div
                    className="flex items-center"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        strokeOpacity={0.5}
                        className="w-8 h-8 mx-2 max-sm:w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.2}
                        stroke="currentColor"
                        strokeOpacity={0.5}
                        className="w-8 h-8 mx-2 max-sm:w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <Link
                  className="flex justify-end text-blue-600 w-4/5 mb-3"
                  to="/forgot"
                >
                  forgot password
                </Link>

                <button
                  className="flex justify-center items-center bg-[#fe6b68] w-4/5 h-[15%] p-2 text-white rounded-xl"
                  type="submit"
                >
                  Submit
                </button>

                <span className="border-t-2 w-4/5 text-center mt-2 pt-2 max-sm:text-sm">
                  Don't have an account
                  <Link className="text-blue-600 ml-3" to="/getOTP">
                    Signup
                  </Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
