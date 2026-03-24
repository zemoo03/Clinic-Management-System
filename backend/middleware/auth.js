const admin = require('firebase-admin');

// Ideally, initialize firebase admin using service account credentials.
// For now, if the env exposes FIREBASE_CREDENTIALS, use it, else alert to config.
// try {
//     const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
//     admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
// } catch (err) {
//     console.warn("⚠️ Firebase Admin Not Configured! Provide FIREBASE_CREDENTIALS in .env");
// }

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        try {
            // Verify token with Firebase (Uncomment when Firebase is initialized)
            // const decodedToken = await admin.auth().verifyIdToken(bearerToken);
            // req.user = decodedToken;
            
            // Mock behavior for testing before Firebase config
            req.user = { uid: "mock-firebase-id", role: "doctor" }; 
            
            next();
        } catch (error) {
            res.status(403).json({ message: 'Invalid or Expired Token' });
        }
    } else {
        // Forbidden
        res.status(401).json({ message: 'Authentication Token Required' });
    }
};

module.exports = verifyToken;
