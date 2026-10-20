export async function getbook(page = 1, limit = 10) {
    const response = await fetch(`http://localhost:5000/api/books?page=${page}&limit=${limit}`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
        books: Array.isArray(data.books) ? data.books : [],
        pagination: {
            ...data.pagination,
            totalPages: data.pagination?.totalPages ?? data.pagination?.totalpages ?? 1,
        }
    };
}
