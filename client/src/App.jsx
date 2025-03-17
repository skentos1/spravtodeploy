import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import PonukyHome from "./Components/PonukyHome";
import "./index.css";
import Sluzby from "./Components/Sluzby";
import Counters from "./Components/Counter";
import Footer from "./Components/Footer";
import CreateJob from "./Components/CreateJob";
import JobSuccess from "./Components/JobSuccess";
import PonukaPrac from "./Components/PonukaPrac";
import JobDetail from "./Components/JobDetail";
import MyAccount from "./Components/MyAccount";
import MyJobs from "./Components/MyJobs";
import Sidebar from "./Components/SideBar";
import axios from "axios";
import MyJobDetail from "./Components/MyJobDetail";
import UserDetail from "./Components/UserDetail";
import SignedUpJobs from "./Components/SignedUpJobs";
import { AuthProvider } from "./Components/AuthContext";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import { Toaster } from "react-hot-toast";
import PrvaPraca from "./Components/PrvaPraca";
import AboutUs from "./Components/AboutUs";
import HowItWorks from "./Components/HowItWorks";
import useWindowSize from "./Components/useWindowSize";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsOfService from "./Components/TermsOfService";
import CookiesPopup from "./Components/CookiesPopUp";
import ProtectedRoute from "./Components/ProtectedRoute";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${import.meta.env.VITE_APP_API_URL}`;

function App() {
  const location = useLocation();
  const size = useWindowSize();
  const showSidebar = [
    "/moj-profil",
    "/moje-prace",
    "/moje-sluzby",
    "/prihlasene-prace",
  ].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          {showSidebar && size.width >= 1024 && (
            <div className="w-64 bg-gray-900 text-white flex-shrink-0 p-4">
              <Sidebar />
            </div>
          )}
          <div
            className={`flex-1 p-6 bg-gray-100 ${
              showSidebar && size.width >= 1024 ? "ml-[-12px]" : ""
            }`}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                    <PonukyHome />
                    <PrvaPraca />
                    <Sluzby />
                    <Counters />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/job-success" element={<JobSuccess />} />
              <Route path="/prace" element={<PonukaPrac />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/myjob/:id" element={<ProtectedRoute><MyJobDetail/></ProtectedRoute>} />
              <Route
                path="/jobs/:jobId/users/:userId"
                element={<ProtectedRoute><UserDetail /></ProtectedRoute>}
              />
              <Route path="/prihlasene-prace" element={<ProtectedRoute><SignedUpJobs /></ProtectedRoute>} />
              <Route path="/moj-profil" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
              <Route path="/moje-prace" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
              <Route path="/moje-sluzby" element={<Sluzby />} />
              <Route path="/o-nas" element={<AboutUs />} />
              <Route path="/ako-fungujeme" element={<HowItWorks />} />
              <Route
                path="/zasady-ochrany-osobnych-udajov"
                element={<PrivacyPolicy />}
              />
              <Route path="/podmienky-sluzby" element={<TermsOfService />} />
            </Routes>
          </div>
        </div>
        <Footer />
        <CookiesPopup />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </AuthProvider>
  );
}

export default App;
