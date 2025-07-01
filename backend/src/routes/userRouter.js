const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", auth(), (req, res) => {
  res.json({ message: "Rota autenticada!", user: req.user });
});

router.get("/only-teacher", auth(["teacher"]), (req, res) => {
  res.json({ message: "Bem-vindo, professor!" });
});

router.get("/only-student", auth(["student"]), (req, res) => {
  res.json({ message: "Bem-vindo, aluno!" });
});

module.exports = router;
