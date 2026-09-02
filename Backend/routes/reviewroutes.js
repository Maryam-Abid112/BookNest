import {updatereview, createreview, deletereview, getreviewbyid } from '../controllers/review.js'
import express from 'express'
import {protect} from '../middleware/middle.js'

const router=express.Router();

router.post("/updatereview",protect,updatereview);
router.post("/createreview",protect,createreview);
router.post("/deletereview",protect,deletereview);
router.get("/getreview/:id",getreviewbyid);

export default router;