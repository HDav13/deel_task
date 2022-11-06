const { Router } = require("express");
const { getContract, getContracts } = require("./controller");

const router = Router();

router.route("/:id").get(getContract);
router.route("/").get(getContracts);

module.exports = router;
