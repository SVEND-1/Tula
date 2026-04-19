import VerifyRegister from "./pages/auth/register/VerifyRegister";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import VerifyResetCode from "./pages/auth/reset-password/VerifyResetCode";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import MainPage from "./pages/main/MainPage";
import AdminAnimals from "./pages/admin/AdminAnimals";
import LikedAnimals from "./pages/liked/LikedAnimals";
import Chat from "./pages/chat/Chat.tsx";
import AnimalDetails from "./pages/animal/AnimalDetails";
import OwnerProfile from "./pages/owner/OwnerProfile";
import PaymentHistoryPage from "./pages/payment-history/PaymentHistoryPage";
import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import {ReceiptsPage} from "./pages/receipt/ReceiptsPage.tsx";
import SuccessSubscriptionPage from "./components/subscription/SuccessSubscriptionPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<VerifyRegister />} />
                <Route path="/reset-verify" element={<VerifyResetCode />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/admin" element={<AdminAnimals />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/liked" element={<LikedAnimals />} />
                <Route path="/animal/:id" element={<AnimalDetails />} />
                <Route path="/owner/:id" element={<OwnerProfile />} />
                <Route path="/payments" element={<PaymentHistoryPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/receipts" element={<ReceiptsPage />}/>
                <Route path="/succeeded-payment" element={<SuccessSubscriptionPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;