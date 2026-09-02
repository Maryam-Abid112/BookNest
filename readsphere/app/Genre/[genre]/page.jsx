import React from 'react'
import Bookcard from '../../../Components/Bookcard'
import Link from 'next/link'; 

export default async function page({params}) {
    const {genre}= await params;
    const data= await fetch(`http://localhost:5000/api/books/genre/${genre}`,{cache:"no-store"});
    const books = await data.json();
    console.log(books)

  return (
    <>
    <div className="container"> <h1 className="mb-4">Results</h1>
       <div className="d-flex flex-row gap-4 flex-wrap">
          {books.book.map((books) => (
            <Bookcard
              key={books._id}
              book={books}
            />
          ))}
          </div>

          
      </div>
    </>
  )
}
