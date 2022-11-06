const {getNotTerminatedContracts} = require("../../service");

const getContract = async (req, res) => {
    const {Contract} = req.app.get('models')
    const clientId = req.profile.get('id')
    const {id} = req.params

    const contract = await getContract({Contract}, id, clientId);

    if (!contract) return res.status(404).end()

    res.json(contract)
}

const getContracts = async (req, res) => {
    const {Contract} = req.app.get('models')
    const id = req.profile.get('id')

    const contracts = await getNotTerminatedContracts({Contract}, id)

    if (!contracts) return res.status(404).end()
    res.json(contracts)
}

module.exports.getContract = getContract;
module.exports.getContracts = getContracts;
