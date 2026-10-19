import Bookcard from "@/components/Bookcard";

export default async function SearchPage({ searchParams }) {

  const { name } = await searchParams;

  const response = await fetch(
    `http://localhost:5000/api/books/search?name=${encodeURIComponent(name)}`,
    {
      cache: "no-store"
    }
  );

  const data = await response.json();
  const books = Array.isArray(data.book) ? data.book : [];

  return (
    <div>
            <div className="container"> <h1 className="mb-4">Results</h1>

         {books.length === 0 ? (
           <p className="text-muted">No books found.</p>
         ) : (
           <div className="d-flex flex-row gap-4 flex-wrap">
             {books.map((book) => (
               <Bookcard key={book._id} book={book} />
             ))}
           </div>
         )}
      </div>
    </div>
  );
}