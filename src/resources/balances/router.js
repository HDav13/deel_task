const { Router } = require("express");
const { deposit } = require("./controller");

const router = Router();

router.route("/deposit/:userId").post(deposit);

module.exports = router;
