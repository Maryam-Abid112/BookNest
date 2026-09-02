import Review from '../model/Review.js';

const createreview = async (req, res) => {
    try {
         const { bookId, rating, comment } = req.body;
        const userId = req.user.id;

       

        const review = await Review.create({
            user: userId,
            book: bookId,
            rating,
            comment,
        });

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error",
        });
    }

}

const updatereview = async (req, res) => {
    try {
         const { id, rating, comment } = req.body;
        // Find the review 
        const review = await Review.findOne({ _id: id });
        if (!review) {
            return res.status(404).json({ message: "Review not found", });
        } // Update the review 
        const updatedReview = await Review.updateOne({
            _id: id,
            user: req.user.id

        }, { rating: rating, comment: comment, });
        return res.status(200).json({ message: "Review updated successfully", updatedReview, });

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }

}
const deletereview = async (req, res) => {
    try {
        const { id } = req.body;

        const review = await Review.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!review) { 
            return res.status(404).json({ message: "Review not found or you are not authorized", }); }

        return res.status(201).json({
            message: "Review deleted successfully"
        });


    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

const getreviewbyid=async(req,res)=>{
    try{
   const{bookid}=req.body;
   const reviews=await Review.find({book:bookid});
   if(reviews.length === 0){
     return res.status(404).json({message:"No reviews found"})
   }
    return res.status(201).json({
        reviews
        });
    }catch(err){
         res.status(500).json({
            message: "Internal server error",
        });
    }
}

export { updatereview, createreview, deletereview ,getreviewbyid};