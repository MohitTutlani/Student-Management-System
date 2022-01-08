const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Student = require("../../models/Student");
const User = require("../../models/User");

//@GET Route
//@DESC Get all the students from the Requseted User's Department
router.get("/", auth, async (req, res) => {
  try {
    const userDept = await User.findById({ _id: req.user.id });
    const students = await Student.find({
      department: userDept.department,
    });
    if (students.length == 0) {
      return res
        .status(400)
        .json({ msg: "There are no Students of this Department" });
    }
    res.json(students);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@POST Route
//@DESC Create a Student or Update Student
router.post(
  "/",
  [
    auth,
    check("rollNumber", "Roll Number is Required!").not().isEmpty(),
    check("name", "Name is Required!").not().isEmpty(),
    check("classOfStudent", "Class is Required!").not().isEmpty(),
    check("department", "Department is Required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      rollNumber,
      name,
      classOfStudent,
      department,
      email,
      phone,
    } = req.body;
    const studentFields = {};
    try {
      if (rollNumber) studentFields.rollNumber = rollNumber;
      if (name) studentFields.name = name;
      if (classOfStudent) studentFields.classOfStudent = classOfStudent;
      if (department) studentFields.department = department;
      if (email) studentFields.email = email;
      if (phone) studentFields.phone = phone;

      let studentProfile = await Student.findOne({
        rollNumber: studentFields.rollNumber,
      });
      if (studentProfile) {
        studentProfile = await Student.findOneAndUpdate(
          { rollNumber: studentFields.rollNumber },
          { $set: studentFields },
          { new: true }
        );
        return res.json(studentFields);
      }
      studentProfile = new Student(studentFields);
      await studentProfile.save();
      res.json(studentProfile);
      console.log(studentProfile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@DELETE Route
//@DESC Delete the Specific Student
router.delete("/:id", auth, async (req, res) => {
  try {
    await Student.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Student Removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
