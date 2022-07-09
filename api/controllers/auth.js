var fire = require("../routes/fire");
var db = fire.firestore();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { studentId, name, password } = req.body;

    // Validate user input
    if (!(studentId && name && password)) {
      res.status(400).json({
        success: false,
        message: "Please provide studentId, name and password",
      });
      return;
    }

    if (studentId.length !== 5) {
      res.status(400).json({
        success: false,
        message: "Student ID must be 9 digits long",
      });
      return;
    }

    firstDigit = parseInt(studentId.substring(0, 1));
    secondDigit = parseInt(studentId.substring(1, 2));
    thirdDigit = parseInt(studentId.substring(2, 3));
    total = parseInt(studentId.substring(3, 5));

    if (firstDigit + secondDigit + thirdDigit !== total) {
      res.status(400).json({
        success: false,
        message: "Student ID not valid",
      });
      return;
    }

    db.collection("users")
      .where("studentId", "==", studentId)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          res.status(400).json({
            success: false,
            message: "Student ID already exists",
          });
          return;
        }
      });

    const encryptedPassword = await bcrypt.hash(password, 10);

    let user = {
      studentId: studentId,
      studentName: name,
      password: encryptedPassword,
    };
    await db.collection("users").add(user);

    const token = jwt.sign(
      { studentId: studentId, name: name },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      success: true,
      data: {
        studentId: studentId,
        name: name,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
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
              process.env.TOKEN_KEY,
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
          } else {
            res.status(400).json({
              success: false,
              message: "Password incorrect",
            });
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
