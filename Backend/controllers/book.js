import Book from '../model/Book.js';
const getallbooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ books: books });

    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal server error" })
    }

}

const getbookbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (book.length==0){
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