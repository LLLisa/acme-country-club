//db
const {
  db,
  seed,
  models: { Member, Facility, Booking },
} = require('./db');

//server setup-----------------------------------------
const express = require('express');
const app = express();

const init = async () => {
  try {
    await db.authenticate();
    await seed();
    const port = 8000;
    app.listen(port, () => {
      console.log(`~~~~~~~~~~~glistening on port ${port}~~~~~~~~~~`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();

//routes--------------------------------
app.get('/', (req, res) => {
  res.redirect('/api');
});

app.get('/api', (req, res) => {
  const html = `
  <html>
    <a href="/api/facilities">facilities</a>
    <a href="/api/members">members</a>

  </html>
  `;
  res.send(html);
});

app.get('/api/facilities', async (req, res, next) => {
  try {
    const bookings = await Facility.findAll({ include: [Booking] });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});

app.get('/api/members', async (req, res, next) => {
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
