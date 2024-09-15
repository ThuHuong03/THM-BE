
import express from 'express';
import { addFertilizer, deleteFertilizer, editFertilizer, getFertilizers, getNameFertilizer } from '../controllers/fertilizer';
const router =express.Router();

router.get('/fertilizers', getFertilizers);

router.post('/fertilizer', addFertilizer);
router.put('/fertilizer/:id', editFertilizer);
router.delete('/fertilizer/:id', deleteFertilizer);
router.get('/fertilizer/:id', getNameFertilizer);

export default router;