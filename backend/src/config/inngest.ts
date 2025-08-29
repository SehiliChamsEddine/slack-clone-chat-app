import { Inngest } from "inngest";
import connectDB from "./db.js";

import User from "../models/User.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "slack-video" });

// Your new function:
const createUser = inngest.createFunction(
  { id: "create-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
        await connectDB();
        const user = event.data;
        const newUser = {
                        email: user.email_addresses[0]?.email_address || "",
                        name: `${user.first_name || ""} ${user.last_name || ""}`,
                        imageUrl: user.image_url || "",
                        clerkId: user.id,
                    };
    
          
        try {
                await User.create(newUser);
                await upsertStreamUser({
                    id: user.id,
                    email: user.email_addresses[0]?.email_address || "",
                    name: `${user.first_name || ""} ${user.last_name || ""}`,
                    imageUrl: user.image_url || "",
                });
               

            } catch (error) {
                console.error("Error creating user:", error);
            }
        } catch (error) {
            console.error("Error connecting to DB:", error);
    }   
  },
);

const deleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      const user = event.data;

      try {
        await User.deleteOne({ clerkId: user.id });
        await deleteStreamUser(user.id);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } catch (error) {
      console.error("Error connecting to DB:", error);
    }
  }
);


export const functions = [
  createUser,deleteUser
];