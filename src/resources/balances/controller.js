const {makeDeposit} = require("../../service");

const deposit = async (req, res) => {
    const id = req.profile.get('id')
    const {amount} = req.body;
    await makeDeposit(req.app.get('models'),  id, amount);
    res.sendStatus(200)
}

module.exports.deposit = deposit
