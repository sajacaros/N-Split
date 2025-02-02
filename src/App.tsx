import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { PurchaseDetailsPageContainer } from './pages/PurchaseDetailsPageContainer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/purchase-details/:id" element={<PurchaseDetailsPageContainer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;