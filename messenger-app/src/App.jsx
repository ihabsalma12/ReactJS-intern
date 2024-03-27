// import './index.css'
import "./my-style.scss";
import Login from "./components/pages/Login.jsx";
import Register from "./components/pages/Register.jsx";
import Home from "./components/pages/Home.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";



function App() {

  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }

    return children
  }
  return (<BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

    </Routes>
  </BrowserRouter>

  );
}

export default App
