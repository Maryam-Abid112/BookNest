
import React from 'react'
import {getbook} from '../../lib/getbook'
import Bookcard from '../../Components/Bookcard'
import Link from 'next/link';
import GenreSearch from '../../Components/Genresearch'

export default async function page() {
    const data = await getbook();
    
 const genres = [
  "Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Horror",
  "Historical Fiction",
  "Adventure",
  "Drama",
  "Crime",
  "Young Adult",
  "Contemporary",
  "Biography",
  "Autobiography",
  "Self-Help",
  "Psychology",
  "History",
  "Poetry",
  "Classics",
];

    // fictional Books
    const fictionbooks= data.filter((book)=>book.genres.includes(genres[0]));
    // Mystery Books
    const mysterybooks= data.filter((book)=>book.genres.includes(genres[1]));
    
    // Romance Books
    const romancebooks= data.filter((book)=>book.genres.includes(genres[3]));
    //psychology Books
    const psychologybooks= data.filter((book)=>book.genres.includes(genres[16]));
    // history Books
    const historybooks= data.filter((book)=>book.genres.includes(genres[17]));

    //Self-Help Books
    const selfhelpbooks= data.filter((book)=>book.genres.includes(genres[15]));
    // Biography Books
    const biographybooks= data.filter((book)=>book.genres.includes(genres[14]));
    // Autobiography Books
    const autobiographybooks= data.filter((book)=>book.genres.includes(genres[13]));
    //Drama Books
    const dramabooks= data.filter((book)=>book.genres.includes(genres[9]));
    //historical Fiction Books
    const historicalfictionbooks= data.filter((book)=>book.genres.includes(genres[7]));
    //thriller Books
    const thrillerbooks= data.filter((book)=>book.genres.includes(genres[2]));
    
    

return(
    
    <>
  <div className="container py-5">



    {/* Browse by Genre */}
    <section className="mb-5">
      <h2 className="mb-4">Browse by Genre</h2>
       <GenreSearch />

      

      <div className="d-flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/Genre/${encodeURIComponent(genre)}`}
            className="btn btn-outline-dark btn-sm"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>


    {/* Fiction Books */}
    <section className="mb-5">
      <h3 className="mb-4">Fiction Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {fictionbooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Mystery Books */}
    <section className="mb-5">
      <h3 className="mb-4">Mystery Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {mysterybooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Romance Books */}
    <section className="mb-5">
      <h3 className="mb-4">Romance Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {romancebooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Thriller Books */}
    <section className="mb-5">
      <h3 className="mb-4">Thriller Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {thrillerbooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Psychology Books */}
    <section className="mb-5">
      <h3 className="mb-4">Psychology Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {psychologybooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* History Books */}
    <section className="mb-5">
      <h3 className="mb-4">History Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {historybooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Drama Books */}
    <section className="mb-5">
      <h3 className="mb-4">Drama Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {dramabooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>


    {/* Self-Help Books */}
    <section className="mb-5">
      <h3 className="mb-4">Self-Help Books</h3>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {selfhelpbooks.slice(0, 6).map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
    </section>



  </div>
</>
    
);}
