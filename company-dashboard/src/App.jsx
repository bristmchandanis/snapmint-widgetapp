import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from './components/common/DashboardLayout';
import { IconSpinner } from './components/common/Icons';
import { apiService, baseUrl } from './utils/constants';
import { appRoutesURL } from './routes/appRoutesURL';

const Login = lazy(() => import('./pages/Login'));
const Stores = lazy(() => import('./pages/Stores'));
const AllMerchants = lazy(() => import('./pages/AllMerchants'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const CashbackOffer = lazy(() => import('./pages/CashbackOffer'));

const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
const isLoggedIn = () => !!localStorage.getItem('token');

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser);
  const isAuth = isLoggedIn();

  const saveUser = (u, token) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    if (token) localStorage.setItem('token', token);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.warn('[Logout] API call note:', err.message);
    }
    localStorage.clear();
    setUser(null);
    navigate(appRoutesURL.login, { replace: true });
  };

  useEffect(() => {
    if (!isLoggedIn()) return;
    apiService.getProfile().then((res) => {
      if (res?.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    }).catch(() => { });
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Navigate to={isAuth ? appRoutesURL.stores : appRoutesURL.login} replace />} />

        <Route path={baseUrl}>
          <Route
            path="login"
            element={
              isAuth ? <Navigate to={appRoutesURL.stores} replace /> : (
                <Suspense fallback={
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <IconSpinner className="w-6 h-6 animate-spin text-gray-900" />
                  </div>
                }>
                  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                    <Login onLoginSuccess={(u, t) => { saveUser(u, t); navigate(appRoutesURL.stores, { replace: true }); }} />
                  </div>
                </Suspense>
              )
            }
          />

          <Route element={isAuth ? <DashboardLayout user={user} onLogout={handleLogout} onUserRoleUpdated={saveUser} /> : <Navigate to={appRoutesURL.login} replace />}>
            <Route index element={<Navigate to={appRoutesURL.stores} replace />} />
            <Route path="stores" element={<Stores user={user} />} />
            <Route path="merchant-onboard/create/:step" element={<AllMerchants user={user} mode="create" />} />
            <Route path="merchant-onboard/create" element={<AllMerchants user={user} mode="create" />} />
            <Route path="merchant-onboard/edit/:editId" element={<AllMerchants user={user} mode="edit" />} />
            <Route path="merchant-onboard/:merchantId" element={<AllMerchants user={user} mode="details" />} />
            <Route path="merchant-onboard" element={<AllMerchants user={user} />} />
            <Route path="widget-customization/*" element={<Navigate to={appRoutesURL.merchantOnboard} replace />} />
            <Route path="widget-customization" element={<Navigate to={appRoutesURL.merchantOnboard} replace />} />
            <Route path="cashback-offer/create" element={<CashbackOffer user={user} mode="create" />} />
            <Route path="cashback-offer/edit/:id" element={<CashbackOffer user={user} mode="edit" />} />
            <Route path="cashback-offer" element={<CashbackOffer user={user} />} />
            <Route path="activity-logs" element={<Analytics user={user} />} />
            <Route path="auto-setup/*" element={<Navigate to={appRoutesURL.stores} replace />} />
            <Route path="auto-setup" element={<Navigate to={appRoutesURL.stores} replace />} />
            <Route path="color-customization/*" element={<Navigate to={appRoutesURL.stores} replace />} />
            <Route path="color-customization" element={<Navigate to={appRoutesURL.stores} replace />} />
            <Route path="profile" element={<Profile currentUser={user} onUserRoleUpdated={saveUser} />} />
            <Route path="*" element={<Navigate to={appRoutesURL.stores} replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuth ? appRoutesURL.stores : appRoutesURL.login} replace />} />
      </Routes>
    </>
  );
}
