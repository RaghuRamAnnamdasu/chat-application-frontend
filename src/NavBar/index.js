import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";


export function Navbar({userDetails}){
    
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
    };

    const signOut = () => {
        localStorage.clear();
        navigate("/login");
        handleClose();
    };

    return(
        <div className = "navbarWrapper">
            <div className = "logoWrapper">
                <img src="./Assets/ChatIon.png" alt="logo" />
            </div>
            <div className = "userWrapper">
                <Button 
                    className = "nameButton" 
                    id = "name-button" 
                    variant="outlined"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                        <div className = "imageWrapper">
                            <img src={userDetails?.image} alt= {userDetails?.userId} />
                        </div>
                        <div className = "nameWrapper">
                            {userDetails?.userName}
                        </div>
                </Button>
                <Menu
                    id="name-menu"
                    MenuListProps={{
                        'aria-labelledby': 'name-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}>
                        <MenuItem onClick = {()=>signOut()}>Signout</MenuItem>
                </Menu>
            </div>
        </div>
    );
}