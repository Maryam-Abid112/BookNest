
import React from "react";

export default function Reviews({ reviews }) {
  return (
    <section className="mt-5 pt-5 border-top">

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Reviews</h2>

        <button className="btn btn-dark">
          Write a Review
        </button>
      </div>

      {/* No Reviews */}
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

    </section>
  );
}
