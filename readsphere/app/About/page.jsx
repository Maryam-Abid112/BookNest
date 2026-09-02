
import Link from "next/link";

export default function About() {
  return (
    <div className="container py-5">

      {/* Hero Section */}
      <section className="text-center py-5">
        <h1 className="display-4 fw-bold mb-3">
          About BookNest
        </h1>

        <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
          Discover your next favorite book, explore different genres,
          and share your thoughts with fellow readers.
        </p>
      </section>

      {/* About BookNest */}
      <section className="mb-5">
        <h2 className="mb-3">What is BookNest?</h2>

        <p>
          BookNest is a book discovery and review platform designed for
          people who love reading. Whether you are looking for a mystery,
          romance, fantasy, thriller, or simply something new to read,
          BookNest makes it easier to discover books that match your interests.
        </p>

        <p>
          You can explore books by genre, search for specific titles,
          read book information, and share your own reviews and ratings.
          Our goal is to create a simple and enjoyable place for readers
          to discover and talk about books.
        </p>
      </section>

      {/* Features */}
      <section className="mb-5">
        <h2 className="mb-4">What You Can Do</h2>

        <div className="row g-4">

          <div className="col-md-4">
            <div className="card h-100 p-4">
              <h4>📚 Discover Books</h4>
              <p className="text-muted">
                Explore a collection of books and discover something
                new to add to your reading list.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4">
              <h4>🔎 Search & Explore</h4>
              <p className="text-muted">
                Search for books by name or browse our collection
                through different genres.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4">
              <h4>⭐ Share Reviews</h4>
              <p className="text-muted">
                Rate books and share your thoughts to help other
                readers decide what to read next.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="mb-5 text-center py-5">
        <h2 className="mb-3">Our Goal</h2>

        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          We want to make discovering books easier and more enjoyable.
          BookNest brings book discovery, reviews, and readers together
          in one place.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-4">
        <h3 className="mb-3">Ready to find your next book?</h3>

        <Link
          href="/book"
          className="btn btn-dark px-4"
        >
          Explore Books
        </Link>
      </section>

    </div>
  );
}
