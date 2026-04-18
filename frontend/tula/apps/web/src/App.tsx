import VerifyRegister from "./pages/auth/register/VerifyRegister";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import VerifyResetCode from "./pages/auth/reset-password/VerifyResetCode";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";




function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />}/>
                <Route path="/verify" element={<VerifyRegister />} />
                <Route path="/reset-verify" element={<VerifyResetCode />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App