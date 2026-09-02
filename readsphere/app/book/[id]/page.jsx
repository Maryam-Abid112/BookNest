import React from 'react'
import Bookdetail from '../../../Components/Bookdetail'
import Reviews from '../../../Components/Reviews'

export default async function page({params}) {
 const {id}= await params;
 const data= await fetch(`http://localhost:5000/api/books/${id}`,{cache:"no-store"});
 const bookdetails= await data.json();
 const book= bookdetails.book;
  console.log(book)

  const response=await fetch(`http://localhost:5000/api/review/getreview/${id}`,{cache:"no-store"});
  const reviews= await response.json();
  const review= reviews.reviews;
  console.log(review);

  return (
    <>
    <Bookdetail book={book} />
      <Reviews reviews={review} />

    </>
  )
}
