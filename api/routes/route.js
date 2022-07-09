var router = require("express").Router();
// var bodyParser = require("body-parser");

// router.use(bodyParser.json());

const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/products");

// router.get("/data", (req, res) => {
//   db.settings({
//     timestampsInSnapshots: true,
//   });
//   var allData = [];
//   db.collection("karyawan")
//     .orderBy("waktu", "desc")
//     .get()
//     .then((snapshot) => {
//       snapshot.forEach((hasil) => {
//         allData.push(hasil.data());
//       });
//       console.log(allData);
//       res.send(allData);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

router.route("/products").get(getProducts).post(createProduct);

router.route("/products/:id").delete(deleteProduct);

module.exports = router;
