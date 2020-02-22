import {
    AppBar,
    Toolbar,
    Typography,
    createTheme,
    ThemeProvider 
  } from "@mui/material";
  
  import "../public/App.css";

  const theme = createTheme({
    palette: {
      primary: {
        main: '#8A90A5',
      },
    },
  });
  
  function Header() {  
    return ( 
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              INFERATICS CCTV
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    );
  }
  
  export default Header;
  