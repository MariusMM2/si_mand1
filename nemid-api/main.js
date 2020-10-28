const express = require('express');
const bodyParser = require('body-parser');
const genderRouter = require('./genderRouter');
const userRouter = require('./userRouter');
const app = express();
const port = 8099;

app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/gender', genderRouter);

app.listen(port, () => {
    console.log(`listening on ${port}`);
});