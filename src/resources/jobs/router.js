const { Router } = require("express");
const { getJobs, payJob } = require("./controller");

const router = Router();

router.route("/unpaid").get(getJobs);
router.route("/:job_id/pay").post(payJob);

module.exports = router;
