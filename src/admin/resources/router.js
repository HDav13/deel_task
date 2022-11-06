const { Router } = require("express");
const { getBestClients, getBestProfession } = require("./controller");

const router = Router();

router.route("/best-profession").get(getBestProfession);
router.route("/best-clients").get(getBestClients);

module.exports = router;
