var router = require("express").Router();
var bodyParser = require("body-parser");

router.use(bodyParser.json());

const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/product");

const { getBalances, createBalance } = require("../controllers/balance");

const { register, login } = require("../controllers/auth");

router.route("/api/products").get(getProducts).post(createProduct);

router.route("/api/products/:id").delete(deleteProduct);

router.route("/api/balances").get(getBalances).post(createBalance);

router.route("/api/login").post(login);
router.route("/api/register").post(register);

module.exports = router;
