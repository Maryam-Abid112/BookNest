"use client";

import React, { useState } from "react";
import addreview from "../lib/review";

export default function Reviews({ reviews = [], bookid }) {
  const [showModal, setShowModal] = useState(false);

  const handleReviews = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const[rating,setrating]=useState();
  const[comment,setcomment]=useState(''); 
  const submitreview=async(e)=>{
    e.preventDefault();
    const data=await addreview(bookid,rating,comment);
    console.log(data);
    alert("Review submitted successfully");
    closeModal();

  }

  return (
    <section className="mt-5 pt-5 border-top">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Reviews</h2>

        <button
          className="btn btn-dark"
          onClick={handleReviews}
        >
          Write a Review
        </button>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-4">
          <h5>No reviews yet</h5>
          <p className="text-muted">
            Be the first person to review this book!
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="card p-4 shadow-sm"
            >
              {/* User + Rating */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  {review.user?.name || "Anonymous"}
                </h5>

                <span className="badge bg-dark">
                  ⭐ {review.rating}/5
                </span>
              </div>

              {/* Review Comment */}
              <p className="mb-0">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  Write a Review
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              {/* Modal Body */}
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">
                    Rating
                  </label>

                  <select className="form-select" value={rating} onChange={(e) => setrating(e.target.value)}>
                    <option value="5">⭐ 5 - Excellent</option>
                    <option value="4">⭐ 4 - Very Good</option>
                    <option value="3">⭐ 3 - Good</option>
                    <option value="2">⭐ 2 - Okay</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Your Review
                  </label>

                  <textarea 
                    className="form-control"
                    rows="4"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
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