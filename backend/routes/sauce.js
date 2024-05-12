// All const required --------------
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');
//--------------------------------------
// SAUCES routes -----------------------
router.get('/', auth, saucesCtrl.allSauces);
router.get('/:id', auth, saucesCtrl.selectedSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);
//--------------------------------------
module.exports = router;