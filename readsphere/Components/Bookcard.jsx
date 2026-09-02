import React from 'react'

export default function Bookcard({ book }) {
    return (

        <>
    
           <div style={{ width: "180px" }}> 
            <div className="card h-100 shadow-sm"> 
                <img src={book.coverImage} className="card-img-top" alt={book.title} style={{ height: "240px", objectFit: "cover" }} /> 
                <div className="card-body p-2"> 
                    <h6 className="card-title mb-1"> {book.title} </h6> 
                    <p className="card-text text-muted small mb-1"> {book.author} </p> 
                    <p className="card-text small mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} > {book.description} </p>
                     <small className="text-muted"> {book.publishedYear} </small>
                      <div className="mt-2"> {book.genres.map((genre, index) => ( <span key={index} className="badge bg-secondary me-1" style={{ fontSize: "10px" }} > {genre} </span> ))} 
                      </div>
                       </div> 
                       </div> 
           </div>

        </>
    )
}
