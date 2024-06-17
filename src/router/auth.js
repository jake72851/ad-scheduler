const express = require('express');
const router = express.Router();

const index = require('../auth/index');

router.get('/', index);
router.get('/facebook', facebook.authorize);
