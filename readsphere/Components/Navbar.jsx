"use client"
import React from 'react'
import { useState ,useEffect} from 'react';
import Search from './Search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Navbar() {
    const [search,setsearch]=useState('');
    const [data,setdata]=useState(null);
    const router = useRouter();
     useEffect(() => {
    const token = localStorage.getItem("token");
    setdata(token);
  }, []);
    

    const handlelogout=()=>{
       localStorage.removeItem("token");
       

    }

    const handlesignup=()=>{
      router.push('/Signup');


    }
    const handlelogin=()=>{
      router.push('/Login');
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
      {(data)?(
        <button className="btn btn-outline-success my-2" onClick={handlelogout}>Logout</button>
      ):(
        <>
        <button className="btn btn-outline-success my-2" onClick={handlelogin}>Login</button>
        <button className="btn btn-outline-success" onClick={handlesignup}>Signup</button>
        </>
      )} 
    </div>
  </div>
</nav></>
  )
}
