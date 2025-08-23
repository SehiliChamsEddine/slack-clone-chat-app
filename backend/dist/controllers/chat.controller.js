import { generateStreamUserToken } from "../config/stream.js";
export const getStreamToken = (req, res) => {
    const token = generateStreamUserToken(req.auth().userId);
    if (token) {
        res.status(200).json({ token });
    }
    else {
        res.status(500).json({ error: "Failed to generate token" });
    }
};
