import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../global";
import "./resetPassword.css";

export function ResetPassword(){

    const navigate = useNavigate();
    const {id, token} = useParams();
    const[password, setPassword] = useState("");
    const [reenteredPassword, setReenteredPassword] = useState("");
    const[invalidErrorMessage, setInvalidErrorMessage] = useState("");

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onReenteredPasswordChange = (e) => {
        setReenteredPassword(e.target.value);
    }

    const onReset = (e) => {

        e.preventDefault();
       
        if(password === reenteredPassword){
            var data = [{
                id: id,
                password: password,
                token: token
            }];
            fetch(`${API}/users/resetPassword`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {"content-type": "application/json"}
            }).then(response => {
                return response.json();
              }).then(jsonResponse => {
                if(jsonResponse.message === "Successful Reset") {
                    navigate("/login");
                } else {
                    setInvalidErrorMessage(jsonResponse.message);
                }
            }).catch((error) => {
                console.log("error", error)
            })
        } else{
            setInvalidErrorMessage("Password doesnot match");
        }
    }
        
       
      

    return(
        <div className="resetPassword">
            <form className="resetContent" onSubmit={(e) => onReset(e)}>
                <h1>Reset Password</h1>
                {invalidErrorMessage && <div className="invalidErrorMessage">{invalidErrorMessage}</div>}
                <div className="passwordWrapper">
                    <label htmlFor="password">Enter new Password</label>
                    <input id="password" type="password" onChange={(e) => onPasswordChange(e)} required/>
                </div>
                <div className="reenteredPasswordWrapper">
                    <label htmlFor="reenteredPassword">Re-enter the new password</label>
                    <input id="password" type="reenteredPassword" onChange={(e) => onReenteredPasswordChange(e)} required/>
                </div>
                <Button type="submit" variant="contained">Reset Password</Button>
            </form>
      </div>
    );
}