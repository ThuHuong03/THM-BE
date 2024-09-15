import express from 'express';
import { getInventory } from '../controllers/inventory';


const router =express.Router();

router.get('/inventory', getInventory);


export default router;