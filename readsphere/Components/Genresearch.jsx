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
     <form onSubmit={handleSearch} className="d-flex mb-4">

        <input
          type="search"
          placeholder="Search Books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form></>
  )
}
