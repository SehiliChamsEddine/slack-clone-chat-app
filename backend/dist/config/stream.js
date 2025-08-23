import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";
const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
    }
    catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};
export const deleteStreamUser = async (userId) => {
    try {
        await streamClient.deleteUser(userId);
    }
    catch (error) {
        console.error("Error deleting Stream user:", error);
    }
};
export const generateStreamUserToken = (userId) => {
    try {
        const token = streamClient.createToken(userId);
        return token;
    }
    catch (error) {
        console.error("Error generating Stream user token:", error);
        return null;
    }
};
