import express from 'express';
import {
  getallbooks,
  getbookbyid,
  searchbook,
} from "../controllers/book.js";

const router = express.Router();

router.get("/", getallbooks);

router.get("/search", searchbook);

router.get("/:id", getbookbyid);

export default router;