const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" format

  if (!token) {
    return res.status(401).json({ error: 'Token nahi mila, login required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalid ya expired hai' });
    }
    req.user = decoded; // { userId, email } request mein attach kar dete hain
    next();
  });
}

module.exports = verifyToken;