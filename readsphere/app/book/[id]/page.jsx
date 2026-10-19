import React from 'react'
import Bookdetail from '../../../Components/Bookdetail'
import Reviews from '../../../Components/Reviews'
import { notFound } from 'next/navigation'

export default async function page({params}) {
 const {id}= await params;
 const data= await fetch(`http://localhost:5000/api/books/${id}`,{cache:"no-store"});
 if (data.status === 404) {
   notFound();
 }
 if (!data.ok) {
   throw new Error(`Failed to fetch book: ${data.status} ${data.statusText}`);
 }
 const bookdetails= await data.json();
 const book= bookdetails.book;
 if (!book) {
   notFound();
 }

  const response=await fetch(`http://localhost:5000/api/review/getreview/${id}`,{cache:"no-store"});
  const reviews = await response.json();
  const review = Array.isArray(reviews.reviews) ? reviews.reviews : [];

  return (
    <>
    <Bookdetail book={book} />
      <Reviews reviews={review} bookid={id} />

    </>
  )
}
