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

router.route("/products").get(getProducts).post(createProduct);

router.route("/products/:id").delete(deleteProduct);

router.route("/balances").get(getBalances).post(createBalance);

router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;
