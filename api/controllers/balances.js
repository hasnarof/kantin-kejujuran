var fire = require("../routes/fire");
var db = fire.firestore();

const getBalances = async (req, res) => {
  try {
    let balancesArray = [];
    const balances = await db.collection("balances").get();
    if (balances.docs.length > 0) {
      for (const balance of balances.docs) {
        balancesArray.push({ id: balance.id, ...balance.data() });
      }
      res.status(200).json({
        success: true,
        data: balancesArray,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No balances found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const createBalance = async (req, res) => {
  try {
    // db.settings({
    //   timestampsInSnapshots: true,
    // });
    const balance = {
      studentId: req.body.studentId,
      studentName: req.body.studentName,
      type: req.body.type,
      amount: req.body.amount,
      timestamp: new Date(),
    };
    const addedBalance = await db.collection("balances").add(balance);
    res.status(201).json({
      success: true,
      data: { id: addedBalance.id, balance },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = { getBalances, createBalance };
