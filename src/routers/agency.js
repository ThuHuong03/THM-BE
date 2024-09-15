import express from 'express';

import { addAgency, getAgencies,editAgency, deleteAgency, getAgencyById  } from '../controllers/agency';
const router =express.Router();

router.get('/agencies', getAgencies);
router.get('/agency/:id', getAgencyById);
router.post('/agency', addAgency);
router.put('/agency/:id', editAgency);
router.delete('/agency/:id', deleteAgency);

export default router;