import express from 'express';

import { addSaleInvoice, getSaleInvoices, editSaleInvoice, deleteSaleInvoice } from '../controllers/saleInvoice';
const router =express.Router();

router.get('/saleInvoices', getSaleInvoices);

router.post('/saleInvoice', addSaleInvoice);
router.put('/saleInvoice/:id', editSaleInvoice);
router.delete('/saleInvoice/:id', deleteSaleInvoice);

export default router;