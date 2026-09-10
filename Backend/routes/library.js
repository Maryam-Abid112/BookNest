import express from 'express'
import {getuserlibrary,addtolibrary,updatelibrary,removefromlibrary} from '../controllers/addtolibrary.js'
import {protect} from '../middleware/middle.js'

const router=express.Router();

router.get('/getlibrary',protect,getuserlibrary);
router.post('/addtolibrary',protect,addtolibrary);
router.post('/updatelibrary',protect,updatelibrary);
router.post('/removefromlibrary',protect,removefromlibrary);

export default router;