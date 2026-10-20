import Book from '../model/Book.js';
const getallbooks = async (req, res) => {
    try {
        const page=Math.max(1,Number.parseInt(req.query.page)||1);
        const limit=Math.max(1,Number.parseInt(req.query.limit)||10);
        const skip=(page-1)*limit;
        const [books,totalbooks] = await Promise.all([
            Book.find().skip(skip).limit(limit).lean(),
            Book.countDocuments()
        ]);
        const totalpages=Math.ceil(totalbooks/limit);

        return res.status(200).json({
      success: true,
      books,
      pagination: {
        currentPage: page,
        limit,
        totalbooks,
        totalpages,
        hasNextPage: page < totalpages,
        hasPrevPage: page > 1
      }
    });

    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal server error" })
    }

}

const getbookbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            console.log("No such book exist");
            return res.status(404).json({ message: "No book found" });
        }

        res.json({ book: book });


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal server error" })

    }

}

const searchbook = async (req, res) => {
    try {
        const { name } = req.query;
        const book = await Book.find({
            title:{
            $regex: name,
            $options: "i",
            }
        });
        if (book.length==0) {
            console.log("No such book exist");
           return res.status(404).json({ message: "No book found" });
        }


        res.json({ book: book });



    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal server error" })
    }

}

const searchbookbygenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const book = await Book.find({
            genres:{
            $regex: genre,
            $options: "i"
            }
        });
        if (!book) {
            console.log("No such book exist");
            res.json({ message: "No book found" });
        }


        res.json({ book: book });



    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal server error" })
    }

}

export {
  getallbooks,
  getbookbyid,
  searchbook,
  searchbookbygenre
};