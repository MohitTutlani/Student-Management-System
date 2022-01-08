const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");

//@GET Route
//@Desc Get Current User Profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no Profile for this User!" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@POST Route
//@DESC Create or Update Profile
router.post(
  "/",
  [
    auth,
    check("phone", "Phone Number is Required!").not().isEmpty(),
    check("skills", "Skills is Required!").not().isEmpty(),
    check("designation", "Designation is Required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phone, address, skills, designation } = req.body;
    const profileFields = {};
    try {
      profileFields.user = req.user.id;

      if (phone) profileFields.phone = phone;
      if (address) profileFields.address = address;
      if (skills) {
        profileFields.skills = skills
          .toString()
          .split(",")
          .map((skill) => skill.trim());
      }
      if (designation) profileFields.designation = designation;
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create Profile
      profile = new Profile(profileFields);
      await profile.save();
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@DELETE Route
//@DESC Delete the Profile of the user
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    res.json({ msg: "Profile Removed!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
