import { Alert, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../global";

import "../Login/login.css";

export function SignUp() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[userName, setUserName] = useState("");
    const[emailError, setEmailError] = useState("");
    const[passwordError, setPasswordError] = useState("");
    const defaultImageURL = "https://th.bing.com/th/id/OIP.1Agw8tPi1oidtC_q4U4ZdgHaHa?w=203&h=203&c=7&r=0&o=5&dpr=1.25&pid=1.7";
    const [image, setImage] = useState(defaultImageURL);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onUserNameChange = (e) => {
        setUserName(e.target.value);
    }

    function isEmailValid() {
        const emailRegexp = new RegExp(
          /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
        );
        if(!emailRegexp.test(email)) {
            setEmailError("Enter a Valid Email Address");
        } else {
            setEmailError("");
        }
    }

    function isPasswordValid() {
         
        if(password.length < 8) {
            const err = "Password should be minimum of 8 characters";
            setPasswordError(err);
        } else {
            setPasswordError("");
        }
    }


    const handleUpload = async (e)=>{
        const files = e.target.files;
        if(files.length) {
            const data = new FormData();
            data.append("file",files[0]);
            data.append("upload_preset","ChatIon");
            setLoading(true);
        
            const response = await fetch("https://api.cloudinary.com/v1_1/raghudevelopments/image/upload",{
                method: "post",
                body: data
            });
            const file = await response.json();
            setImage(file.secure_url);
            setLoading(false);
        }
    }
            

    const onSignUp = async (e) => {
        e.preventDefault();
        var data = [{
            email: email,
            password: password,
            userName: userName,
            displayPic: image
        }];
        const result = await fetch(`${API}/users/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"content-type": "application/json"}
            }).then(response => {
                return response.json();
            }).catch (error => {
                console.log(error)
            })

        if(result.emailError){
            setEmailError(result.message);
        } else if(result.passwordError){
            setPasswordError(result.message);
        }else {
            navigate("/login");
        }
    };

    return (
        <div className="signup">
            <form className="signupContent" onSubmit={(e) => onSignUp(e)}>
                <div className="profilePhotoUploadWrapper">
                    <div className = "signUpimageWrapper">
                        {loading ? <div className="signUpLoading">Loading...</div> :<img src={image} alt="image" />}
                    </div>
                    <div className="uploadFileWrapper">
                        <label htmlFor="upload">{image && image !== defaultImageURL ? "Replace Picture" : "Upload Picture"}</label>
                        <input id="upload" type="file"  name="file" placeholder='Select Image' onChange={handleUpload} />
                    </div>
                </div>
                <div className="displayNameWrapper">
                    <label htmlFor="display">User Name</label>
                    <input id="display" type="text" onChange={(e) => onUserNameChange(e)} required/>
                </div>
                <div className="emailWrapper">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" onChange={(e) => onEmailChange(e)} onBlur={isEmailValid} className={emailError ? "redBorderInput" : ""} required/>
                    <div className="emailError">{emailError}</div>
                </div>
                <div className="passwordWrapper">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={(e) => onPasswordChange(e)} onBlur={isPasswordValid} className={passwordError ? "redBorderInput" : ""} required/>
                    <div className="passwordError">{passwordError}</div>
                </div>
                <Button type="submit" variant="contained" disabled={loading}>Sign up</Button>
                <div className="accountExists">Already have an account? <span onClick={() => navigate("/login")}>&nbsp;Login</span></div>
            </form>
      </div>
    );
}