import '../env/env';
import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { routes } from './api';

import models from './models';

dotenv.config();

const app = express();

// force: true일 경우 서버가 재시작 될 때마다 DB가 초기화 되므로
// 초기 실행 후 주석처리
// if (process.env.DB_SYNC || process.env.DB_SYNC === 'false') {
//   console.log('Sequelize Initialize');
//   models.sequelize
//     .sync({ force: true })
//     .then(() => {
//       console.log('Sequelize Success');
//     })
//     .catch(err => {
//       console.log('Sequelize Error : ', err);
//     })
// }

app.disable('x-powered-by');

app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Router 설정
routes.forEach(route => {
  app[route.method](
    route.path,
    [...route.middleware],
    route.controller
  );
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;