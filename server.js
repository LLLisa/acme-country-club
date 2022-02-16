//db setup--------------------------------------
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/acme_country_club');
const { STRING, UUID, UUIDV4 } = Sequelize;

const Member = db.define('member', {
  name: Sequelize.STRING,
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

const Facility = db.define('facility', {
  name: Sequelize.STRING,
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

const Booking = db.define('booking', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  bookerId: {
    type: UUID,
  },
  facilityId: {
    type: UUID,
  },
});

Booking.belongsTo(Facility);
Facility.hasMany(Booking);
Member.belongsTo(Member, { as: 'sponsor' }); //each include needs its own alias
Member.hasMany(Member, { foreignKey: 'sponsorId', as: 'sponsee' });

const seed = async () => {
  try {
    await db.sync({ force: true });
    const lucy = await Member.create({ name: 'lucy' });
    const moe = await Member.create({ name: 'moe', sponsorId: lucy.id });
    const ethyl = await Member.create({ name: 'ethyl', sponsorId: moe.id });
    const larry = await Member.create({ name: 'larry', sponsorId: lucy.id });
    const tennis = await Facility.create({ name: 'tennis' });
    const ping_pong = await Facility.create({ name: 'ping pong' });
    const marbles = await Facility.create({ name: 'marbles' });
    await Booking.create({ bookerId: lucy.id, facilityId: marbles.id });
    await Booking.create({ bookerId: lucy.id, facilityId: marbles.id });
    await Booking.create({ bookerId: moe.id, facilityId: tennis.id });
    lucy.sponsee = moe.id;
    lucy.sponsee = larry.id;
    ethyl.sponsee = moe.id;
    await Promise.all([lucy.save(), ethyl.save()]);
  } catch (error) {
    console.log(error);
  }
};

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
