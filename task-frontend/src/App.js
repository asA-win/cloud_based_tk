// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import TaskPage from "./components/TaskPage";
import RegisterForm from "./components/RegisterForm";
import AlarmWatcher from "./components/AlarmWatcher"; 

function App() {
  return (
    <Router>
      <AlarmWatcher />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/tasks" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
