require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var playersRouter = require('./routes/playersRoutes');
var cardsRouter = require('./routes/cardsRoutes');
var LeaderboardRouter = require('./routes/leaderboardRoutes');

var adminRouter = require('./routes/adminRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/players', playersRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/leaderboard', LeaderboardRouter);

app.use('/api/admin', adminRouter);
module.exports = app;