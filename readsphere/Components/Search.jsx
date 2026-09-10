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
    <form
      onSubmit={handleSearch}
      className="d-flex"
      role="search"
    >

      <input
        type="search"
        className="form-control me-2"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        type="submit"
        className="btn btn-dark px-3"
      >
        Search
      </button>

    </form>
  );
}