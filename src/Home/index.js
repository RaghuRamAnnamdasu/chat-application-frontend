import { debounce, IconButton } from "@mui/material";
import { Navbar } from "../NavBar";
import "./home.css";
import SearchIcon from '@mui/icons-material/Search';
import { ChatConversations } from "../chatConversations";
import { useEffect, useRef, useState } from "react";
import { API, socketAPI } from "../global";
import { ConversationContent } from "../ConversationContent";
import SendIcon from '@mui/icons-material/Send';
import {io} from "socket.io-client";
import { SearchResultsCard } from "../SearchResultCard";

export function Home(){

    const [userConversations, setUserConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState("");
    const [conversationMessages, setConversationMessages] = useState([]);
    const [friendDetails, setFriendDetails] = useState(null);
    const [typedMessage, setTypedMessage] = useState("");
    const endScrollRef = useRef();
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [finalSocketMessage, setFinalSocketMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchedText, setSearchedText] = useState(null);
    const [defaultConversation, setDefaultConversation] = useState(true);
    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    console.log("in home userdetails++++++", userDetails);

    useEffect(()=>{
        if(userConversations.length && defaultConversation) {
            const friendId = userConversations[0].receiver_id === userDetails?.userId ?  userConversations[0].sender_id : userConversations[0].receiver_id; 
            getUserDetailsById(friendId, userConversations);
            setDefaultConversation(false);
        }
        
    },[userConversations])

    useEffect(()=>{
        getAllConversationsByUser();
    },[userDetails,conversationMessages]);

    useEffect(()=>{
        getAllMessagesForConversation();
    },[currentConversationId]);

    useEffect(()=>{
        endScrollRef.current && endScrollRef.current.scrollIntoView({behavior: "smooth"});
    },[conversationMessages]);

    useEffect(()=>{
        setSocket(io(socketAPI));
        setUser(userDetails);   
    },[]);

    useEffect(()=>{
        socket?.on("getMessageFromSocketServer",(data)=>{
            let newMessage = {
                "conversation_id": currentConversationId,
                "sender_id": data.senderId,
                "message": data.message,
                "messageSentTime": new Date()
            }
            setFinalSocketMessage(newMessage);
        });
    });

    useEffect(()=>{
        socket?.emit("addUser",userDetails?.userId);
        socket?.on("getUsersToClient",(users)=>{
            setOnlineUsers(users);
        })
    },[user]);

    useEffect(()=>{
        const data = [...conversationMessages];
        finalSocketMessage && friendDetails._id === finalSocketMessage.sender_id && setConversationMessages([...data,finalSocketMessage]);
    },[finalSocketMessage]);


    const getAllConversationsByUser = async ()=>{
        let result = await fetch(`${API}/conversation/${userDetails.userId}`);
        result = await result.json();
        setUserConversations(result);
    }

    const getAllMessagesForConversation = async ()=>{
        let result = await fetch(`${API}/messages/${currentConversationId}`);
        result = await result.json();
        setConversationMessages(result);
    }

    const postMessage = async (data)=>{
        let result = await fetch(`${API}/messages/addConversationMessage`,{
            method: "POST",
            body: JSON.stringify(data),
            headers: {"content-type": "application/json"}
        });
        result = await result.json();
        getAllMessagesForConversation();
    }


    const getFriendDetails = (id, friendDetails)=>{
        setCurrentConversationId(id);
        setFriendDetails(friendDetails);
    }

    const getSearchResults = async (text)=>{
        let result = await fetch(`${API}/search/${userDetails?.userId}/${text}/getSearchResults`);
        result = await result.json();
        setSearchResults(result);
    }

    const getUserDetailsById = async (id, userConv)=>{
        let friend = await fetch(`${API}/users/${id}`);
        friend = await friend.json();
        setFriendDetails(friend[0]);
        setCurrentConversationId(userConversations[0]._id);
    }

    const handleMessage = (evt)=>{
        setTypedMessage(evt.target.value);
    }

    const handleSendMessage = async(evt)=>{
        evt.preventDefault();
        const messageData = {
            "conversation_id": currentConversationId,
            "sender_id": userDetails.userId,
            "message": typedMessage
        }

        const receiverId = conversationMessages.length && (conversationMessages.find((message)=>message.sender_id!==userDetails.userId)).sender_id;
        if(typedMessage.length) {
            socket.emit("sendMessageFromClient",{
                senderId: userDetails.userId,
                receiverId,
                message: typedMessage
            });
            postMessage(messageData);
        }
        setTypedMessage("");
        evt.target.reset();
    }

    const handleSearch = (evt)=>{
        setSearchedText(evt.target.value);
        debounceSearch(evt.target.value);
    }

    const debounceSearch = debounce((text) => {
        if(text.length) {
            getSearchResults(text);
        } else {
            setSearchResults(null);
            setSearchedText("");
        }
    }, 300);

    return(
        <div className = "homeWrapper">
            <Navbar userDetails={userDetails} />
            <div className = "chatContainer">
                <div className="chatListWrapper">
                    <div className = "searchEnclosure">
                        <input className = "searchField" type = "text" value={searchedText} placeholder = "Search for People" onChange={handleSearch}/>
                        <SearchIcon className = "searchIcon" />
                        {
                            searchResults &&
                            (searchResults.length ? searchResults.map((searchResult)=>{
                                return <SearchResultsCard searchResult={searchResult} userDetails={userDetails}
                                            getAllConversationsByUser={getAllConversationsByUser}
                                            setSearchResults={setSearchResults}
                                            setCurrentConversationId={setCurrentConversationId}
                                            setDefaultConversation={setDefaultConversation}
                                            setFriendDetails={setFriendDetails}
                                            setSearchedText={setSearchedText}
                                        />
                            }) :
                            <div className="noSearchResultsText">No results found</div>)
                        }
                    </div>
                    {
                        !searchResults && userConversations && userConversations.map((conversation)=>{
                            return <ChatConversations userDetails={userDetails} conversation={conversation} 
                                        getFriendDetails={getFriendDetails} conversationMessages={conversationMessages} 
                                        onlineUsers={onlineUsers}
                                    />
                        })
                    }
                </div>
                <div className="chatDetailsWrapper">
                    {friendDetails &&
                        <div className="friendDetailsHeader">
                            <img src= {friendDetails.displayPic} alt = {friendDetails.userName} />
                            <div className = "friendName">{friendDetails.userName}</div>
                        </div>
                    }
                    <div className="chatConversationWrapper">
                        {
                            conversationMessages && conversationMessages.map((message)=>{
                                return(
                                <div ref={endScrollRef}>
                                    <ConversationContent userDetails={userDetails} message={message} />
                                </div>
                            )})
                        }
                    </div>
                    {friendDetails && <form className = "textInputEnclosure" onSubmit = {handleSendMessage}>
                        <textarea className = "messageTextField" onBlur={handleMessage} placeholder = "Enter your message here"/>
                        <IconButton className = "sendButton" type="submit">
                            <SendIcon />
                        </IconButton>
                    </form>}
                </div>
            </div>
        </div>
    );
}