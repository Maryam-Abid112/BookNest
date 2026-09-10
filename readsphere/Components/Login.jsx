"use client"
import React, { useContext } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import login from '../lib/login';
import Link from 'next/link';
import { AuthContext } from '../context/Authcontext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setToken, setname } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      if(data.message=="No User exists"){
        alert("Incorrect Email or Password");
      }

      if (!data?.token) {
        console.error("Login failed: no token received");
        return;
      }

      const userName = data?.user?.name;

      localStorage.setItem("token", data.token);
      if (userName) {
        localStorage.setItem("name", userName);
        setname(userName);
      }
      setToken(data.token);
      router.push('/book');
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (
    <>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div
      className="card shadow p-4"
      style={{ width: "100%", maxWidth: "450px" }}
    >
      <h2 className="text-center mb-4">Login</h2>

      <form onSubmit={handleLogin}>

        <div className="mb-3">
          <label className="form-label">Email</label>

          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100"
        >
          Login
        </button>

      </form>

      <p className="text-center mt-3 mb-0">
        Want to create an account?{" "}
        <Link href="/Signup">
          Sign Up
        </Link>
      </p>

    </div>
  </div>
    </>
  )
}
