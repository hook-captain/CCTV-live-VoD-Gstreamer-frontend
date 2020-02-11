import {
    AppBar,
    Toolbar,
    Typography,
  } from "@mui/material";
  
  import "../public/App.css";
  
  function Header() {  
    return (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              INFERATICS CCTV
            </Typography>
          </Toolbar>
        </AppBar>
    );
  }
  
  export default Header;
  