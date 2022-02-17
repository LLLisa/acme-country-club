const express = require('express');
const router = express.Router();

const {
  db,
  seed,
  models: { Member, Facility, Booking },
} = require('../db');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const bookings = await Facility.findAll({ include: [Booking] });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});
