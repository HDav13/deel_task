const {findBestProfession, findBestClients} = require("../../service");

const getBestProfession = async (req, res) => {
    const {start, end} = req.query;
    if (!start || !end) return res.send('End or Start not provided').status(400).end()

    const bestProfession = await findBestProfession(req.app.get('models'), start, end)
    if (!bestProfession) return res.send('No completed job for period').status(404).end()
    res.json({totalAmount: bestProfession.dataValues.totalAmount, mostEarnedProfession: bestProfession.Contract.Contractor.profession})
}

const getBestClients = async (req, res) => {
    const {start, end, limit = 2} = req.query;
    if (!start || !end) return res.send('End or Start not provided').status(400).end()

    const bestClients = await findBestClients(req.app.get('models'), start, end, limit);

    res.json(bestClients)
}

module.exports.getBestProfession = getBestProfession;
module.exports.getBestClients = getBestClients;
