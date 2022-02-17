const express = require('express');
const router = express.Router();

module.exports = router;

const {
  db,
  seed,
  models: { Member, Facility, Booking },
} = require('../db');

router.get('/', (req, res) => {
  const html = `
  <html>
    <a href="/api/facilities">facilities</a>
    <a href="/api/members">members</a>

  </html>
  `;
  res.send(html);
});
