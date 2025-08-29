import logo from './logo.svg';
import './App.css';
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate';
import Chat from './Pages/Chat/Chat';
import Login from './Pages/Login/Login';
import { Routes,Route } from 'react-router-dom';

function App() {
  return (
   <>

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<ProfileUpdate />} />
    </Routes>

   </>

  );
}

export default App;
