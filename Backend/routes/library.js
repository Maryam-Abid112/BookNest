import express from 'express'
import {getuserlibrary,addtolibrary,updatelibrary,removefromlibrary} from '../controllers/addtolibrary'
import {protect} from '../middleware/middle'

const router=express.Router();

router.get('/getlibrary',protect,getuserlibrary);
router.post('/addtolibrary',protect,addtolibrary);
router.post('/updatelibrary',protect,updatelibrary);
router.post('/removefromlibrary',protect,removefromlibrary);

export default router;