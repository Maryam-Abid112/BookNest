"use client";

import React, { useState, useEffect } from "react";
import {
  getLibrary,
  removelibrary,
  updatelibrary,
} from "../../lib/Library";

export default function Library() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const data = await getLibrary();
      setLibrary(data.library);
    };

    fetchLibrary();
  }, []);

  const removelibraryitem = async (id) => {
    const data = await removelibrary(id);
    console.log(data);

    const updatedlibrary = library.filter(
      (item) => item._id !== id
    );

    setLibrary(updatedlibrary);

    alert("Book removed from library");
  };

  const updatelibraryitem = async (id, status) => {
    const data = await updatelibrary(id, status);
    console.log(data);

    const updatedlibrary = library.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          status: status,
        };
      }

      return item;
    });

    setLibrary(updatedlibrary);

    alert("Library updated");
  };

  return (
    <div className="container py-5">

      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">My Library</h1>
        <p className="text-muted">
          Keep track of the books you want to read, are reading, or have completed.
        </p>
      </div>

      {library.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Your library is empty 📚</h4>
          <p className="text-muted">
            Add some books to your library to see them here.
          </p>
        </div>
      ) : (
        <div className="row g-4">

          {library.map((item) => (

            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
              key={item._id}
            >

              <div className="card h-100 shadow-sm border-0">

                {/* Book Cover */}
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: "280px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    style={{
                      maxHeight: "250px",
                      maxWidth: "85%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column">

                  <h5 className="card-title fw-bold">
                    {item.book.title}
                  </h5>

                  <p className="text-muted mb-2">
                    by {item.book.author}
                  </p>

                  {/* Status */}
                  <div className="mb-3">

                    <span className="fw-semibold">
                      Status:
                    </span>{" "}

                    <span className="badge bg-secondary">
                      {item.status}
                    </span>

                  </div>

                  {/* Update Status */}
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updatelibraryitem(
                        item._id,
                        e.target.value
                      )
                    }
                    className="form-select mb-3"
                  >
                    <option value="wishlist">
                      Wishlist
                    </option>

                    <option value="reading">
                      Reading
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>

                  {/* Remove Button */}
                  <button
                    className="btn btn-outline-danger w-100 mt-auto"
                    onClick={() =>
                      removelibraryitem(item._id)
                    }
                  >
                    Remove from Library
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}