
"use client";

import React, { useState } from "react";
import addreview from "../lib/review";

export default function Reviews({ reviews = [], bookid }) {
  const [showModal, setShowModal] = useState(false);

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const handleReviews = () => {
    const token=localStorage.getItem("token");
    if(!token){
      alert("Please login to write the review");
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const submitreview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    const data = await addreview(bookid, rating, comment);

    console.log(data);

    alert("Review submitted successfully");

    setComment("");
    setRating("5");
    closeModal();
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="container mt-5 pt-5 border-top">

      {/* ================= HEADER ================= */}

      <div className="row align-items-center mb-5">

        {/* Title */}
        <div className="col-md-7">
          <h2 className="fw-bold mb-2">
            Reader Reviews
          </h2>

          <p className="text-muted mb-0">
            See what other readers think about this book.
          </p>
        </div>

        {/* Write Review Button */}
        <div className="col-md-5 text-md-end mt-3 mt-md-0">

          <button
            className="btn btn-dark px-4 py-2"
            onClick={handleReviews}
          >
            ✍ Write a Review
          </button>

        </div>

      </div>


      {/* ================= RATING SUMMARY ================= */}

      {reviews.length > 0 && (

        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">

            <div className="row align-items-center">

              {/* Average Rating */}
              <div className="col-md-4 text-center border-md-end">

                <h1 className="display-4 fw-bold mb-0">
                  {averageRating}
                </h1>

                <div className="text-warning fs-4">
                  {"★".repeat(Math.round(Number(averageRating)))}
                  {"☆".repeat(5 - Math.round(Number(averageRating)))}
                </div>

                <p className="text-muted mb-0">
                  Based on {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>

              </div>


              {/* Small Summary */}
              <div className="col-md-8 mt-4 mt-md-0 ps-md-5">

                <h5 className="fw-semibold mb-2">
                  What readers are saying
                </h5>

                <p className="text-muted mb-0">
                  Readers have shared their thoughts and
                  experiences about this book. Read the reviews
                  below to see different perspectives.
                </p>

              </div>

            </div>

          </div>
        </div>

      )}


      {/* ================= REVIEWS ================= */}

      {reviews.length === 0 ? (

        <div className="text-center py-5">

          <div className="fs-1 mb-3">
            📖
          </div>

          <h4 className="fw-bold">
            No reviews yet
          </h4>

          <p className="text-muted mb-4">
            Be the first reader to share your thoughts!
          </p>

          <button
            className="btn btn-dark px-4"
            onClick={handleReviews}
          >
            Write the First Review
          </button>

        </div>

      ) : (

        <div>

          <h4 className="fw-bold mb-4">
            All Reviews
          </h4>

          <div className="d-flex flex-column gap-4">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="card border-0 shadow-sm"
              >

                <div className="card-body p-4">

                  {/* User + Rating */}
                  <div className="d-flex justify-content-between align-items-start">

                    {/* User */}
                    <div className="d-flex align-items-center">

                      <div
                        className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center me-3"
                        style={{
                          width: "45px",
                          height: "45px",
                          fontWeight: "bold",
                        }}
                      >
                        {(
                          review.user?.name ||
                          "A"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h6 className="fw-bold mb-1">
                          {review.user?.name || "Anonymous"}
                        </h6>

                        <small className="text-muted">
                          BookNest Reader
                        </small>

                      </div>

                    </div>


                    {/* Rating */}
                    <div className="text-end">

                      <div className="text-warning fs-5">
                        {"★".repeat(Number(review.rating))}
                        {"☆".repeat(
                          5 - Number(review.rating)
                        )}
                      </div>

                      <small className="text-muted">
                        {review.rating}/5
                      </small>

                    </div>

                  </div>


                  {/* Divider */}
                  <hr className="my-3" />


                  {/* Comment */}
                  <p className="mb-0 text-secondary">
                    "{review.comment}"
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* ================= MODAL ================= */}

      {showModal && (

        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        >

          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >

            <div className="modal-content border-0 shadow-lg">

              {/* Modal Header */}
              <div className="modal-header px-4 py-3">

                <div>

                  <h5 className="modal-title fw-bold">
                    Write a Review
                  </h5>

                  <small className="text-muted">
                    Share your thoughts about this book
                  </small>

                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />

              </div>


              {/* Modal Body */}
              <div className="modal-body p-4">

                {/* Rating */}
                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Your Rating
                  </label>

                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) =>
                      setRating(e.target.value)
                    }
                  >

                    <option value="5">
                      ⭐⭐⭐⭐⭐ 5 - Excellent
                    </option>

                    <option value="4">
                      ⭐⭐⭐⭐ 4 - Very Good
                    </option>

                    <option value="3">
                      ⭐⭐⭐ 3 - Good
                    </option>

                    <option value="2">
                      ⭐⭐ 2 - Okay
                    </option>

                    <option value="1">
                      ⭐ 1 - Poor
                    </option>

                  </select>

                </div>


                {/* Comment */}
                <div className="mb-2">

                  <label className="form-label fw-semibold">
                    Your Review
                  </label>

                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="What did you think about this book?"
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* Modal Footer */}
              <div className="modal-footer px-4">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-dark px-4"
                  onClick={submitreview}
                >
                  Submit Review
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

