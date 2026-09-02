import React from 'react'
import Link from 'next/link'

export default function Bookdetail({ book }) {
    return (
        <>
            <div className="container py-5">

                {/* Back Button */} <Link href="/" className="btn btn-outline-dark mb-4"> ← Back to Books </Link>
                {/* Book Details */}
                <div className="row g-5"> {/* Cover */}
                    <div className="col-md-4">
                        <img src={book.coverImage} alt={book.title} className="img-fluid rounded shadow" />
                    </div> {/* Information */}
                    <div className="col-md-8">
                        <h1 className="display-5 fw-bold mb-3"> {book.title} </h1>
                        <h4 className="text-muted mb-4"> by {book.author} </h4>
                        <p className="mb-4"> {book.description} </p> {/* Published Year */} <p>
                            <strong>Published:</strong> {book.publishedYear} </p> {/* Genres */}
                        <div className="mb-4"> <strong>Genres:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2"> {book.genres.map((genre) => (<Link key={genre} href={`/Genre/${encodeURIComponent(genre)}`} className="badge text-bg-light border text-decoration-none" > {genre} </Link>))}
                            </div>
                        </div>
                    </div></div></div>
                    
        </>
    )
}
