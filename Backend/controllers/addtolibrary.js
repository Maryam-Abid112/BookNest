import UserLibrary from "../model/library.js";

const addtolibrary = async (req, res) => {
    try {
        const { bookid, status } = req.body
        const userId = req.user.id;

        const library = await UserLibrary.create({ user: userId, book: bookid, status: status });

        return res.status(201).json({ message: "Added to the Library", library });

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }

}

const removefromlibrary = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;

        const library = await UserLibrary.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!library) {
            return res.status(404).json({ message: "Review not found or you are not authorized", });
        }

        return res.status(201).json({ message: "Remove from library" });



    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });

    }

}

const updatelibrary = async (req, res) => {
    try {
        const { id, status } = req.body;
        const userId = req.user.id;
        const library = await UserLibrary.findOneAndUpdate({ _id: id, user: userId }, { status: status });
        if (!library) {
            return res.status(404).json({ message: "Review not found or you are not authorized", });
        }
        return res.status(201).json({ message: "Library Updated", library });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });

    }

}

const getuserlibrary = async (req, res) => {
    try {
        const userId = req.user.id;

        const library = await UserLibrary.find({
            user: userId,
        });

        return res.status(200).json({
            library,
        });



    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export {getuserlibrary,addtolibrary,updatelibrary,removefromlibrary};