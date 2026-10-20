
import Bookcard from "./Bookcard";
import Link from "next/link";
import { getbook } from "../lib/getbook";

export default async function Page({ searchParams }) {
  const params = (await searchParams) ?? {};

  const page = Math.max(1, Number(params.page) || 1);
  const limit = 10;

  const data = await getbook(page, limit);
  const books = Array.isArray(data.books) ? data.books : [];
  const pagination = data.pagination || {
    currentPage: page,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  };

  return (
    <div className="container">
      <h1 className="mb-4">Books Collection</h1>

      <div className="d-flex flex-row gap-4 flex-wrap">
        {books.map((book) => (
          <Bookcard key={book._id} book={book} />
        ))}
      </div>
<div className="d-flex justify-content-center align-items-center gap-2 mt-4">

  {Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  ).map((pageNumber) => (
    <Link
      key={pageNumber}
      href={`/book?page=${pageNumber}`}
      className={`btn ${
        pageNumber === page
          ? "btn-primary"
          : "btn-outline-primary"
      }`}
    >
      {pageNumber}
    </Link>
  ))}

</div>
    </div>
  );
}
