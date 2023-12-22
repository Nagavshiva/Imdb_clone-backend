const jwt = require('jsonwebtoken');

const secretKey = process.env.TOKEN;

function generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id }, secretKey);
    return token;
}

function verifyAuthToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (ex) {
        return null;
    }
}

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(authenticateJWT)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const decoded = auth.verifyAuthToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
}

module.exports = {
    generateAuthToken,
    verifyAuthToken,
    authenticateJWT
};