"use client"
import React from 'react'
import { useState } from 'react';
import Search from './Search';
import Link from 'next/link';
export default function Navbar() {
    const [search,setsearch]=useState("");

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

      <button   className="btn btn-outline-success my-2">Login</button>
      <button  className="btn btn-outline-success">Signup</button>
    </div>
  </div>
</nav></>
  )
}
