var fire = require("../routes/fire");
var db = fire.firestore();

const getProducts = async (req, res) => {
  try {
    let productsArray = [];
    const productsQuery = db.collection("products");

    if (req.query.timestampDesc == 1) {
      productsQuery.orderBy("timestamp", "desc");
    } else {
      productsQuery.orderBy("timestamp");
    }
    if (req.query.nameDesc == 1) {
      productsQuery.orderBy("name", "desc");
    } else {
      productsQuery.orderBy("name");
    }

    const products = await productsQuery.get();

    if (products.docs.length > 0) {
      for (const product of products.docs) {
        productsArray.push({ id: product.id, ...product.data() });
      }
    }
    res.status(200).json({
      success: true,
      data: productsArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    db.settings({
      timestampsInSnapshots: true,
    });
    const product = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      timestamp: new Date(),
    };
    const addedProduct = await db.collection("products").add(product);
    res.status(201).json({
      success: true,
      data: { id: addedProduct.id, ...product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("products").doc(id).delete();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = { getProducts, createProduct, deleteProduct };
