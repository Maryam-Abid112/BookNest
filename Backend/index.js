import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import bookRoutes from "./routes/book.js";
import userroutes from './routes/user.js'
import  reviewroutes from './routes/reviewroutes.js';



dotenv.config();

const app = express();

connectDB();
//cors basically controls which frontend origins are allowed to make requests to your backend.
app.use(cors({
    origin:"http://localhost:3000",
}));

app.use(express.json());
app.use("/api/books", bookRoutes);
app.use("/api/User", userroutes);
app.use("/api/review",reviewroutes);

app.get("/", (req, res) => {
  res.send("Booknest API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});