import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";
import VerifyEmailToken from "./pages/verifyEmail/verifyEmailToken";
import Profile from "./pages/ProfileUpdate/ProfileUpdate";
import ChatPage from "./pages/Chat/Chat";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PageWrapper>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <PublicRoute>
                <Register />
              </PublicRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />

        {/* Verify Email Routes */}
        <Route
          path="/verify-email"
          element={
            <PageWrapper>
              <VerifyEmail />
            </PageWrapper>
          }
        />
        <Route
          path="/verify-email/:token"
          element={
            <PageWrapper>
              <VerifyEmailToken />
            </PageWrapper>
          }
        />

        {/* Private Routes */}
        <Route
          path="/chat"
          element={
            <PageWrapper>
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// ✅ PageWrapper بيحتوي على الهيدر والفوتر وكمان الانيميشن
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} // يبدأ مختفي
      animate={{ opacity: 1 }} // يظهر
      exit={{ opacity: 0 }} // يختفي عند الخروج
      transition={{ duration: 0.2 }}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </motion.div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
