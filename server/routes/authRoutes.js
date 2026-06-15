const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.post("/test", (req, res) => {
    console.log("TEST HIT");
    res.json({
        message: "Working"
    });
});

module.exports = router;