var router = require("express").Router();
// var bodyParser = require("body-parser");

// router.use(bodyParser.json());

const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/products");

const { getBalances, createBalance } = require("../controllers/balances");

router.route("/products").get(getProducts).post(createProduct);

router.route("/products/:id").delete(deleteProduct);

router.route("/balances").get(getBalances).post(createBalance);

module.exports = router;
