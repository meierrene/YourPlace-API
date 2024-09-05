const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const { validationResult } = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch {
    return next(
      new HttpError('Something went wrong to find from database.', 500)
    );
  }

  if (!place)
    return next(new HttpError('Could not find place for the provided id', 404));

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch {
    return next(
      new HttpError('Something went wrong to find from database.', 500)
    );
  }
  if (!userWithPlaces.places.length)
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    );
  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );

  const { title, description, address } = req.body;

  let location;
  try {
    location = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image: req.file.path,
    creator: req.userData.userId,
  });

  const user = await User.findById(req.userData.userId);

  if (!user)
    return next(new HttpError('Could not find find user for provided id', 404));

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    if (place.creator.toString() !== req.userData.userId)
      return next(new HttpError('Not authorized', 403));
    place.title = title;
    place.description = description;
    await place.save();
  } catch {
    return next(
      new HttpError('Something went wrong to update to database.', 500)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
    if (!place)
      return next(new HttpError('Could not find place for this id.', 404));

    if (place.creator.id !== req.userData.userId)
      return next(new HttpError('Not authorized', 403));

    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch {
    return next(
      new HttpError('Something went wrong to delete from database.', 500)
    );
  }

  fs.unlink(place.image, err => console.log(err));

  res.json({ message: 'Place deleted.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
