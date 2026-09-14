"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signup from "../lib/signup";
import { AuthContext } from "../context/Authcontext";

export default function page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setToken, setname } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const data = await signup(name, email, password);

      if (!data?.token) {
        console.error("Signup failed: no token received");
        return;
      }

      const userName = data?.user?.name || name;

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", userName);
      setname(userName);
      setToken(data.token);
      router.push("/book");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };



return (
  <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div
      className="card shadow p-4"
      style={{ width: "100%", maxWidth: "450px" }}
    >
      <h2 className="text-center mb-4">Create Account</h2>

      <form onSubmit={handleSignup}>

        <div className="mb-3">
          <label className="form-label">Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          Sign Up
        </button>

      </form>

      <p className="text-center mt-3 mb-0">
        Already have an account?{" "}
        <Link href="/Login">
          Login
        </Link>
      </p>

    </div>
  </div>
);
}