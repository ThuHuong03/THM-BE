import express from 'express';

import { addProvider,editProvider, deleteProvider, getProviders, getProviderById  } from '../controllers/provider';
const router =express.Router();

router.get('/providers', getProviders);
router.get('/provider/:id', getProviderById)
router.post('/provider', addProvider);
router.put('/provider/:id', editProvider);
router.delete('/provider/:id', deleteProvider);

export default router;