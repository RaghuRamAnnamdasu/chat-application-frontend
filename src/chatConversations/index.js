import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { API } from "../global";
import "./chatConversations.css";


export function ChatConversations({userDetails, conversation, getFriendDetails, conversationMessages, onlineUsers}){

    const [chatFriendId, setChatFriendId] = useState("");
    const [friendDetails, setFriendDetails] = useState({});
    const [isOnlineUser, setIsOnlineUser] = useState(false);

    useEffect(()=>{
        friendDetails[0] && onlineUsers &&
        onlineUsers.map((user)=>user.userId).includes(friendDetails[0]._id) ? setIsOnlineUser(true) : setIsOnlineUser(false);
    },[onlineUsers, friendDetails[0]]);

    useEffect(()=>{
        conversation.sender_id === (userDetails && userDetails.userId) ? setChatFriendId(conversation.receiver_id) : setChatFriendId(conversation.sender_id);
    },[conversation, conversationMessages]);

    useEffect(()=>{
        if(chatFriendId !== "") {
            getChatFriendDetails(chatFriendId);
        }
    },[chatFriendId]);

    const getChatFriendDetails = async function(chatFriendId){
        let chatFriendDetails = await fetch(`${API}/users/${chatFriendId}`);
        chatFriendDetails = await chatFriendDetails.json();
        setFriendDetails(chatFriendDetails);
    }
    
    return(
        <div className = "conversationContainer">
            {friendDetails[0] &&
                <div className = "conversationTitleCard" onClick = {()=>getFriendDetails(conversation._id, friendDetails[0])}>
                    <img src= {friendDetails[0].displayPic} alt = {friendDetails[0].userName} />
                    <div className="chatNameWrapper">
                        <div className = "chatName">{friendDetails[0].userName}</div>
                        {
                            !conversation.areConversationMessagesExists ?
                                <div className = "conversationMessagesCheck">Draft</div> : 
                                null
                        }
                    </div>
                    <div className = "status">
                        <div className = {isOnlineUser ? "online" : "offline"} />
                    </div>
                </div>
            }
        </div>
    );
}