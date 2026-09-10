"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useContext } from 'react';
import Search from './Search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Navbar() {

  const { token, setToken ,name,setname} = useContext(AuthContext);
  console.log(name);


  const router = useRouter();

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setname(null);
  }

  const handlesignup = () => {
    router.push('/Signup');


  }
  const handlelogin = () => {
    router.push('/Login');
  }

  const handleuser=()=>{
    router.push('/library');
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><b>BookNest</b></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/book">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/About">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/Genre">Genre</Link>
              </li>
            </ul>
            <Search />
            {(token) ? (
              <>
                <button className="btn btn-outline-success my-2 mx-3" onClick={handlelogout}>Logout</button>
                <div 
                  className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center me-3" onClick={handleuser}
                  style={{
                    width: "45px",
                    height: "45px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {(name ? name : "A").charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <button className="btn btn-outline-dark my-2 mx-3" onClick={handlelogin}>Login</button>
                <button className="btn btn-outline-dark" onClick={handlesignup}>Signup</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
