import express from 'express';

import { addBill, deleteBill, editBill, getBills } from '../controllers/bill';
const router =express.Router();

router.get('/bills', getBills);

router.post('/bill', addBill);
router.put('/bill/:id', editBill);
router.delete('/bill/:id', deleteBill);

export default router;