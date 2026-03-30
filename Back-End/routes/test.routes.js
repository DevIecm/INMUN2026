/**
 * Ruta: '/api/test'
 */

const { Router } = require('express');
const { testPost } = require('../controllers/test.controller');

const router = Router();

router.post('/', testPost);

module.exports = router;