const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadMedia, listMedia } = require('../controllers/media.controller');

const router = express.Router();

router.post('/upload', authMiddleware, uploadMedia);
router.get('/', authMiddleware, listMedia);

module.exports = router;
