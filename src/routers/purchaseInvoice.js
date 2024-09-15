import express from 'express';

import { addPurchaseInvoice, deletePurchaseInvoice, editPurchaseInvoice, getPurchaseInvoices } from '../controllers/purchaseInvoice';
const router =express.Router();

router.get('/purchaseInvoices', getPurchaseInvoices);

router.post('/purchaseInvoice', addPurchaseInvoice);
router.put('/purchaseInvoice/:id', editPurchaseInvoice);
router.delete('/purchaseInvoice/:id', deletePurchaseInvoice);

export default router;