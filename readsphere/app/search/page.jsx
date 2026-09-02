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

  console.log(data);

  return (
    <div>
            <div className="container"> <h1 className="mb-4">Results</h1>

         <div className="d-flex flex-row gap-4 flex-wrap">
      {data.book.map((books) => (
        <Bookcard
          key={books._id}
          book={books}
        />
      ))}
      </div>
      </div>
    </div>
  );
}