import "./conversationContent.css";

export function ConversationContent({userDetails, message}){
    return(
        <div className = {(userDetails && userDetails.userId) === (message && message.sender_id) ? "myMessageEnclosure" : "friendMessageEnclosure"}>
            <div className = "messageContent">{message.message}</div>
            <div className = "messageDeliveryTime">{new Date(message.messageSentTime).toLocaleString()}</div>
        </div>
    );
}