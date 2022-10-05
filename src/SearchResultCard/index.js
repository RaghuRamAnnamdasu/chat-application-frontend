import { API } from "../global";
import "./searchResultCard.css";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";


export function SearchResultsCard({searchResult, setSearchedText, userDetails, getAllConversationsByUser, setSearchResults,setCurrentConversationId,setDefaultConversation,setFriendDetails}){

    // const [conversationId, setConversationId] = useState(null);

    const getConversationIdFromUserIDS = async (id1, id2)=>{
        let conversationId = await fetch(`${API}/conversation/getConversationId/${id1}/${id2}`);
        conversationId = await conversationId.json();
        setCurrentConversationId(conversationId);
        setFriendDetails(searchResult);
        setSearchResults(null);
        setSearchedText("");
    }

    
    const addNewConversation = async (data)=>{
        let result = await fetch(`${API}/conversation/addConversation`,{
            method: "POST",
            body: JSON.stringify(data),
            headers: {"content-type": "application/json"} 
        });
        result = await result.json();
        const newConversationId = result.insertedId;

        if(newConversationId){
            getAllConversationsByUser();
            setDefaultConversation(true);
            setSearchResults(null); 
            setSearchedText("");
            // setCurrentConversationId(newConversationId);
        }else{
            const receiver_id = searchResult && searchResult._id;
            const sender_id = userDetails && userDetails.userId;
            getConversationIdFromUserIDS(sender_id,receiver_id);
        }
        
        console.log("newConversation in search........", newConversationId);
    };

    

    const onSearchResultsClick = ()=>{
        
        var conversationObj = {
            "sender_id": userDetails && userDetails.userId,
            "receiver_id": searchResult && searchResult._id
        }
        addNewConversation(conversationObj);
    };

    return(
        <div className = "serachCardEnclosure" onClick={onSearchResultsClick}>
            <img src= {searchResult.displayPic} alt = {searchResult.userName} />
            <div>{`${searchResult.userName}  <${searchResult.email}>`}</div>
        </div>
    );
}