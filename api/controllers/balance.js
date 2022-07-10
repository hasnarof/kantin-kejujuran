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
      message: error.message,
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
    let addedBalance = await db.collection("balances").add(balance);
    // .then(async (docRef) => {
    //   await db
    //     .collection("balances")
    //     .doc(docRef.id)
    //     .get()
    //     .then((snapshot) => {
    //       addedBalance = snapshot.data();
    //     });
    // });
    res.status(201).json({
      success: true,
      data: { id: addedBalance.id, ...balance },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const balance = await db.collection("balances").doc("balance").get();
    res.status(200).json({
      success: true,
      data: balance.data(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBalance = async (req, res) => {
  try {
    const transaction = {
      type: req.body.type,
      amount: req.body.amount,
    };
    const query = await db.collection("balances").doc("balance").get();
    let balance = query.data();
    if (transaction.type === "debit") {
      balance.amount = parseInt(balance.amount) + parseInt(transaction.amount);
    } else {
      balance.amount = parseInt(balance.amount) - parseInt(transaction.amount);
    }

    await db.collection("balances").doc("balance").update(balance);
    res.status(201).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getBalances, createBalance, getBalance, updateBalance };
