const authService = require('../services/AuthService');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();