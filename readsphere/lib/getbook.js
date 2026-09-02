

export async function getbook() {
    const response =await fetch("http://localhost:5000/api/books/",
    {    cache:"no-store"
    });
    const wdata=await response.json();
    const data=wdata.books;
    return data;

}
