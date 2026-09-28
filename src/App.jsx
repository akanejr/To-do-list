import { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { StoreProvider } from './state/store';
import Splash from './screens/Splash';
import Home from './screens/Home';
import CreateDelivery from './screens/CreateDelivery';
import Estimate from './screens/Estimate';
import Partners from './screens/Partners';
import PartnerProfile from './screens/PartnerProfile';
import Confirm from './screens/Confirm';
import Created from './screens/Created';
import Tracking from './screens/Tracking';
import History from './screens/History';

/** Keeps each route's scroll position + entry animation independent. */
function Routed() {
  const location = useLocation();
  return (
    <div className="app" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/send" element={<CreateDelivery />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/partners/:id" element={<PartnerProfile />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/created/:id" element={<Created />} />
        <Route path="/track/:id" element={<Tracking />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="appframe">
        <span className="proto-chip">
          <span className="dot" aria-hidden="true" />
          <b>SwiftLine</b> Phase 1 · customer prototype
        </span>
        <Routed />
      </div>
    </StoreProvider>
  );
}
