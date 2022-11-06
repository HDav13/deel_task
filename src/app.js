const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contractsRouter = require("./resources/contracts/router");
const jobsRouter = require("./resources/jobs/router");
const balancesRouter = require("./resources/balances/router");
const adminRouter = require("./admin/resources/router");

app.use("/contracts", getProfile, contractsRouter);
app.use("/jobs", getProfile, jobsRouter);
app.use("/balances", getProfile, balancesRouter);
app.use("/admin", getProfile, adminRouter);

module.exports = app;
