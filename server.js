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
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`~~~~~~~~~~~glistening on port ${port}~~~~~~~~~~`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();

//routes--------------------------------
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/members', require('./routes/members'));
app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.redirect('/api');
});
