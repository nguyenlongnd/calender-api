const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const cors = require('cors');

const corsOption = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOption));

app.use(express.static(path.join(__dirname, './dist/apps/calendar-app')));
app.get(/^(?!\/api\/)/, (req, res) => {
  res.sendFile(path.join(__dirname, './dist/apps/calendar-app/index.html'));
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(res.status(404).send({ error: 'Not found' }));
});

const port = process.env.CALENDAR_APP_PORT || 5003;
server.listen(port, () => {
  console.log('App is listening on port ', port);
});