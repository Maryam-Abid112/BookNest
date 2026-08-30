import {updatereview, createreview, deletereview } from '../controllers/review.js'
import express from 'express'
import {protect} from '../middleware/middle'

const router=express.Router();

router.post("/updatereview",protect,updatereview);
router.post("/createreview",protect,createreview);
router.post("/deletereview",protect,deletereview);

export default router;