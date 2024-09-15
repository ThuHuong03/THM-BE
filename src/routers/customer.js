import express from 'express';
import { addCustomer, deleteCustomer, editCustomer, getCustomerById, getCustomers } from '../controllers/customer';
const router =express.Router();

router.get('/customers', getCustomers);
router.get('/customer/:id', getCustomerById);
router.post('/customer', addCustomer);
router.put('/customer/:id', editCustomer);
router.delete('/customer/:id', deleteCustomer);

export default router;