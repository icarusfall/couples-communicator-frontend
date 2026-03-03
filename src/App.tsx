import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PublicLayout from "./components/PublicLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PairingPage from "./pages/PairingPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import AccountPage from "./pages/AccountPage";
import LandingPage from "./pages/LandingPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PrivacyPage from "./pages/PrivacyPage";
import EthicsPage from "./pages/EthicsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/ethics" element={<EthicsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/pairing" element={<PairingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
