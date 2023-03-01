const express = require('express');
const router = express.Router();

const { 
 allVersions,
 singleVersion,
 updateSingleVersion,
 delSingleVersion,
 checkUserVersion,
 refreshData
} = require('../controllers/v1Controller');

router.get('/refreshdata', refreshData)
router.get('/versions', allVersions)
router.get('/version/:id', singleVersion)
router.patch('/version/:id', updateSingleVersion)
router.delete('/version/:id', delSingleVersion)
router.post('/checkversion/:agent', checkUserVersion)

module.exports = router