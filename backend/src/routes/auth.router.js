const express = require("express");
const userService = require("../services/auth.service");

const router = express.Router();


router.get('/', async (req, res) => {
  const users = await userService.findAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
});

router.get('/:id', async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const updatedUser = await userService.update(req.params.id, req.body);
  if (!updatedUser) return res.status(404).json({ error: 'User not found.' });
  res.json(updatedUser);
});

module.exports = router;