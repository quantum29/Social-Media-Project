import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar from "scenes/navbar";
// dark mode aur light mode kaise implement kiye ??
// ek global state banaye mode ke nam se joh yah toh either light yah dark hoga(redux ka use karke, toolkit se code simple hua)
//createTheme material theme call kiye aur usme apna theme configuration provide kiye 
// theme configuration provide karne ke liye theme.js se themeSettings(mode) call kiye aur depending mode ka kya value hai 
// theme,js se ek object return hoga jisme mere defined theme style hai aur usko call kare create theme mai pass kar diye 
// aur finally last mai ThemeProvider mai theme ={mydefinedtheme} mai wrap karke uske children mai app pas kar diye 
function App() {
  const mode = useSelector((state) => state.mode)
  // useSelector -> A hook to access the redux store's state.
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  //  useMemo is a React hook used for memoization. It takes two arguments: a function and a dependency array.
  // When you create a functional component in React, it can re-render whenever its parent component re-renders, even if the props passed to it haven't changed. This can be inefficient, especially for complex components.
  // React.memo allows you to wrap a functional component and memoize it. Memoization is a technique that stores the previous result of a function and returns that result if the function is called again with the same inputs. In the context of React, React.memo ensures that a functional component will only re-render when its props change.
  const isAuth = Boolean(useSelector((state) => state.token))

  //cssBaseline se css reset that browser already provided for us
  //element property of react that render whatever is passed
  //ThemeProvider takes theme and sets the Css for the React components
  // isAuth is boolean not Jwt  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>

          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
              // element={ <HomePage /> }
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;
// When you create a functional component in React, it can re-render whenever its parent component re-renders, even if the props passed to it haven't changed. This can be inefficient, especially for complex components.
// React.memo allows you to wrap a functional component and memoize it. Memoization is a technique that stores the previous result of a function and returns that result if the function is called again with the same inputs. In the context of React, React.memo ensures that a functional component will only re-render when its props change.