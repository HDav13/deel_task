const { getUnpaidJobs, jobPayment} = require("../../service");

const getJobs = async (req, res) => {
    const {Contract, Job} = req.app.get('models')
    const id = req.profile.get('id')
    const jobs = getUnpaidJobs({Job, Contract}, id)

    if (!jobs) return res.status(404).end()

    res.json(jobs)
}

const payJob = async (req, res) => {
    const {Contract, Job, Profile} = req.app.get('models')
    const id = req.profile.get('id')
    const {job_id: jobId} = req.params
    const job = await jobPayment({Job, Contract, Profile}, id, jobId)

    if(!job) {
        return res.status(404).end()
    }

    await payJob(Profile, Job, job)

    res.sendStatus(200)
}

module.exports.getJobs = getJobs;
module.exports.payJob = payJob;
