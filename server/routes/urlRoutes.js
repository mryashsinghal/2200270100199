import express from 'express';
import {
  createShortUrl,
  redirectToOriginalUrl,
  getAllStats
} from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/stats', getAllStats);
router.get('/:code', redirectToOriginalUrl);

export default router;
