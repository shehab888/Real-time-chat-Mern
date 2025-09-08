import "./App.css";
import ProfileUpdate from "./Pages/ProfileUpdate/ProfileUpdate";
import Chat from "./Pages/Chat/Chat";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register";
import Home from "./Pages/Home/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import PrivateRoute from "./Components/PrivateRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Register />
            </motion.div>
          }
        />
        {/* ✅ Chat محمية */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Chat />
              </motion.div>
            </PrivateRoute>
          }
        />
        {/* ✅ Profile محمية */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileUpdate />
              </motion.div>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Header />
      <AnimatedRoutes />
      <Footer />
    </>
  );
}

export default App;
