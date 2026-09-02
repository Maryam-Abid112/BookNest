import React from 'react'

export default function() {
  return (
    <>
    {/* Hero Section */}
      <div
        className="position-relative"
        style={{
          height: "450px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        ></div>

        {/* Hero Text */}
        <div
          className="position-relative d-flex flex-column justify-content-center align-items-center h-100 text-white text-center"
        >
          <h1 className="display-3 fw-bold">
            Discover Your Next Story
          </h1>

          <p className="lead">
            Explore our collection of books and find your next favorite.
          </p>
        </div>
      </div></>
  )
}
