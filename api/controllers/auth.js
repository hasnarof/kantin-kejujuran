require("dotenv").config();
var fire = require("../routes/fire");
var db = fire.firestore();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = process.env.TOKEN_KEY || "HASNACANTIK";

const register = async (req, res) => {
  try {
    const { studentId, name, password } = req.body;

    // Validate user input
    if (!(studentId && name && password)) {
      return res.status(400).json({
        success: false,
        message: "Please provide studentId, name and password",
      });
    }

    if (studentId.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Student ID must be 5 digits long",
      });
    }

    firstDigit = parseInt(studentId.substring(0, 1));
    secondDigit = parseInt(studentId.substring(1, 2));
    thirdDigit = parseInt(studentId.substring(2, 3));
    total = parseInt(studentId.substring(3, 5));

    if (firstDigit + secondDigit + thirdDigit !== total) {
      return res.status(400).json({
        success: false,
        message: "Student ID not valid",
      });
    }

    const oldUser = await db
      .collection("users")
      .where("studentId", "==", studentId)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          return res.status(400).json({
            success: false,
            message: "Student ID already exists",
          });
        }
        return;
      });

    if (oldUser) {
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    // const encryptedPassword = bcrypt.hash(password, 10);

    let user = {
      studentId: studentId,
      studentName: name,
      password: encryptedPassword,
    };
    await db.collection("users").add(user);
    // db.collection("users").add(user);

    const token = jwt.sign({ studentId: studentId, name: name }, tokenKey, {
      expiresIn: "2h",
    });

    return res.status(201).json({
      success: true,
      data: {
        studentId: studentId,
        name: name,
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Validate user input
    if (!(studentId && password)) {
      res.status(400).json({
        success: false,
        message: "Please provide studentId and password",
      });
      return;
    }

    db.collection("users")
      .where("studentId", "==", studentId)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          res.status(400).json({
            success: false,
            message: "Student ID not found, please register",
          });
          return;
        }
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
              { studentId: studentId, name: user.studentName },
              tokenKey,
              {
                expiresIn: "2h",
              }
            );
            res.status(200).json({
              success: true,
              data: {
                studentId: studentId,
                name: user.studentName,
                token: token,
              },
            });
            return;
          } else {
            res.status(400).json({
              success: false,
              message: "Password incorrect",
            });
            return;
          }
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, login };
