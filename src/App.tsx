import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserDemo from './components/UserDemo';
import AdminDemo from './components/AdminDemo';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 用户demo路由 */}
        <Route path="/user" element={<UserDemo />} />
        {/* 管理者demo路由 */}
        <Route path="/admin_demo" element={<AdminDemo />} />
        {/* 默认重定向到用户demo */}
        <Route path="/" element={<Navigate to="/user" />} />
        {/* 其他路径重定向到用户demo */}
        <Route path="*" element={<Navigate to="/user" />} />
      </Routes>
    </Router>
  );
};

export default App;