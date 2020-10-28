const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./indexRouter');
const userRouter = require('./userRouter');
const genderRouter = require('./genderRouter');

const port = 8099;
const app = express();

app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/gender', genderRouter);

app.listen(port, () => {
    console.log(`listening on ${port}`);
});