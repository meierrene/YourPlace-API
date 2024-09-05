const express = require('express');
const placesController = require('../controllers/places-controller');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/user/:uid', placesController.getPlacesByUserId);

router.get('/:pid', placesController.getPlaceById);

router.use(checkAuth);

router
  .route('/:pid')
  .patch(
    [
      check('title').notEmpty(),
      check('description').isLength({ min: 5, max: 1000 }),
    ],
    placesController.updatePlace
  )
  .delete(placesController.deletePlace);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5, max: 1000 }),
    check('address').notEmpty(),
  ],
  placesController.createPlace
);

module.exports = router;
