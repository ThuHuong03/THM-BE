import express from 'express';

import getInvoices from '../controllers/invoice';
const router =express.Router();

router.get('/invoices', getInvoices);

export default router;