const {Op, literal} = require("sequelize");
const {sequelize} = require("../model");
const getContract = async(models, id, clientId) => {
    return Contract.findOne({where: {id}, [Op.or]: [{ClientId: clientId}, {ContractorId: clientId}]})
}

const getNotTerminatedContracts = async (models, id) => {
    return models.Contract.findAll({
        where: {
            status: {[Op.not]: 'terminated'},
            [Op.or]: [{ClientId: id}, {ContractorId: id}]
        }
    })
}

const getUnpaidJobs = async(models, id ) => {
    return models.Job.findAll({
        include: [{
            model: models.Contract,
            attributes: [],
            where: {[Op.or]: [{ClientId: id}, {ContractorId: id}]},
        }], where: {paid: {[Op.not]: true},}
    })
}

const getJob = async(models, clientId, jobId ) => {
    return models.Job.findOne({
        include: [{
            model: Contract,
            where: {ClientId: id, id: jobId},
            include: [{model: Profile, as: 'Client', where: {balance: {[Op.gt]: 0}}}]
        }], where: {paid: {[Op.not]: true}},
    })
}

const jobPayment = async(Profile, Job, job, ) => {
    await sequelize.transaction(async (t) => {
        await Profile.update({
            balance: literal(`balance - ${job.price}`)
        }, {
            where: {id: job.Contract.ClientId},
        }, {transaction: t});

        await Profile.update({
            balance: literal(`balance + ${job.price}`)
        }, {
            where: {id: job.Contract.ContractorId},
        }, {transaction: t});

        await Job.update({
            paid: true,
            paymentDate: new Date(),
        }, {
            where: {id: job.id}
        }, {transaction: t})
    });
}

const makeDeposit = async (models, id, amount) => {
    const job  = await models.Job.findOne({
        include: [{
            model: models.Contract,
            where: {[Op.or]: [{ClientId: id}]},
            include: [{model: models.Profile, as: 'Client'}],
        }],
        where: {
            paid: {[Op.not]: true},
        },
        group: ['Contract.Client.id'],
        attributes: [
            'Contract.Client.id',
            [sequelize.fn('sum', sequelize.col('price')), 'totalAmount'],
        ],
    })
    await sequelize.transaction(async (t) => {
        if (job.dataValues.totalAmount / 4 < amount) return res.send('Client can not deposit more than 25% his total of jobs to pay').status(400).end()
        await models.Profile.update({
            balance: job.Contract.Client.balance + amount
        }, {
            where: {id: job.Contract.ClientId},
        }, {transaction: t}).catch(err => console.log(err));

        console.log(await models.Profile.findOne({where: {id: job.Contract.ClientId}}))
    })
}

const findBestProfession = async (models, start, end) => {
    return models.Job.findOne({
        include: [{
            model: models.Contract, include: [{model: models.Profile, as: 'Contractor'}]
        }],
        where: {
            paid: {[Op.eq]: true},
            paymentDate: {[Op.between]: [start, end]}
        },
        group: ['Contract.Contractor.profession'],
        attributes: [
            'Contract.Contractor.profession',
            [sequelize.fn('sum', sequelize.col('price')), 'totalAmount'],
        ],
        order: [[
            'totalAmount',
            'DESC'
        ]],
    })
}

const findBestClients = async (models, start, end, limit) => {
    const jobs = await models.Job.findAll({
        include: [{
            model: models.Contract, include: [{model: models.Profile, as: 'Client'}]
        }],
        where: {
            paid: {[Op.eq]: true},
            paymentDate: {[Op.between]: [start, end]}
        },
        group: ['Contract.Client.id'],
        attributes: [
            'Contract.Client.id',
            [sequelize.fn('sum', sequelize.col('price')), 'totalAmount'],
        ],
        order: [[
            'totalAmount',
            'DESC'
        ]],
        limit,
    });

    if (!jobs.length) return [];

    return jobs.map(job => ({
        totalAmount: job.dataValues.totalAmount,
        name: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`
    }))
};

module.exports.getNotTerminatedContracts = getNotTerminatedContracts;
module.exports.getContract = getContract;
module.exports.getUnpaidJobs = getUnpaidJobs;
module.exports.getJob = getJob;
module.exports.jobPayment = jobPayment;
module.exports.makeDeposit = makeDeposit;
module.exports.findBestProfession = findBestProfession;
module.exports.findBestClients = findBestClients;
