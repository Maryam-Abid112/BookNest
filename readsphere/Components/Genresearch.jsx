"use client"
import React from 'react'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenreSearch() {
    const [search, setSearch] = useState("");
    const router = useRouter();
     const handleSearch = (e) => {
      e.preventDefault();
      if (!search.trim()) return;
      router.push(`/Genre/${encodeURIComponent(search)}`);
    };
  return (
    <>
    <form
      onSubmit={handleSearch}
      className="d-flex align-items-center gap-2 mb-4"
      role="search"
      style={{ maxWidth: '420px' }}
    >

      <input
        type="search"
        className="form-control"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '280px' }}
      />

      <button
        type="submit"
        className="btn btn-dark px-3"
      >
        Search
      </button>

    </form></>
  )
}
