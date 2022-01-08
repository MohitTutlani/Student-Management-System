const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @Post Route
// @Desc User Registration/Signup
router.post(
  "/",
  [
    check("name", "Name is Required!").not().isEmpty(),
    check("email", "Email is Required!").isEmail(),
    check("password", "Password is Required!").isLength({ min: 8 }),
    check("department", "Department is Required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, department } = req.body;
    try {
      //Check if user already Exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }
      //Avatar Generate
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      //User Object
      user = new User({
        name,
        email,
        avatar,
        password,
        department,
      });
      //Password Encrypting
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      //Token Generate
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@Get Request
//@Desc Get the User of the Particular Department
router.get("/", auth, async (req, res) => {
  try {
    const userDept = await User.findById({
      _id: req.user.id,
    });
    const users = await User.find(
      {
        department: userDept.department,
      },
      null,
      { sort: { name: 1 } },
      (err, user) => {
        if (err) {
          console.log(err);
          process.exit(1);
        } else {
          console.log(user);
          res.json(user);
        }
      }
    ).select("-password");
    if (!users) {
      return res
        .status(400)
        .json({ msg: "There are no teacheres of this Department...!" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
