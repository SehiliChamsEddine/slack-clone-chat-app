
import { useUser } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const useStreamClient = () => {
    const { user } = useUser();
    const [streamClient, setStreamClient] = useState<StreamChat | null>(null);
    const {data:tokenData,error:tokenError,isLoading:tokenLoading} = useQuery(
        {queryKey:["streamToken"], 
        queryFn: getStreamToken, 
        enabled: !!user,
    });

    useEffect(() => {
        if (!user || !tokenData) return;

        const initializeStreamClient = async () => {
            try {
                const { token } = tokenData;
                // Initialize your stream client with the token
                const client = StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser(
                    {
                        id: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                        image: user.imageUrl,
                    }, token
                );
                setStreamClient(client);
               
            } catch (error) {
                console.error("Error initializing stream client:", error);
                Sentry.captureException(error,{
                   tags : {
                    Component : "useStreamChat",
                    
                   },
                   extra : {
                    userId : user.id ,
                    context : "stream_chat_connection",
                    streamApiKey : STREAM_API_KEY ? "present" : "missing"
                   }
                });
            }
        }

        initializeStreamClient();

        return () => {
            if (streamClient) {
                streamClient.disconnectUser();
            }
        }


    }, [user,tokenData,streamClient]);

    return { streamClient , tokenError , tokenLoading };

}







export default useStreamClient;