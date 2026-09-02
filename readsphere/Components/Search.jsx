"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/search?name=${encodeURIComponent(search)}`);
  };

  return (
    
      
      <form onSubmit={handleSearch}>

        <input
          type="search"
          placeholder="Search Books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form>


  );
}