const addreview = async (bookid, rating, comment) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      bookId: bookid,
      rating: Number(rating),
      comment,
    };

    const response = await fetch("http://localhost:5000/api/review/createreview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default addreview;