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
    const members = await Member.findAll({
      include: [
        { model: Member, as: 'sponsor' },
        { model: Member, as: 'sponsee' },
      ],
    });
    res.send(members);
  } catch (error) {
    next(error);
  }
});
