import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";
import DashboardLayout from "../components/Layout/DashboardLayout";
import SettingsLayout from "../components/Layout/SettingsLayout";
import Cookies from "js-cookie";
import NotFound from "../pages/NotFound";

// --- Auth Pages ---
import SignUpForm from "../components/Forms/SignUpForm";
import VerifyOtp from "../components/Forms/VerifyOtp";
import ChangeEmailForm from "../components/Forms/ChangeEmailForm";
import CompleteProfileForm from "../components/Forms/CompleteProfileForm";
import LoginForm from "../components/Forms/LoginForm";
import VerifyEmail from "../components/Forms/VerifyEmail";
import ChangePassword from "../components/Forms/ChangePassword";
import AddPaymentInfo from "../components/Forms/AddPaymentInfo";
import PaymentMethods from "../pages/PaymentMethods";
import AccountSuccessPage from "../pages/Auth/AccountSuccessPage";

// --- Dashboard Pages ---
import HomePage from "../pages/Home/HomePage";
import CommunitiesPage from "../pages/Communities/CommunitiesPage";
import CommunityPage from "../pages/Communities/CommunityPage";
import ProductPage from "../pages/Communities/ProductPage";
import InvitesPage from "../pages/Invites/InvitesPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import WalletPage from "../pages/Wallet/WalletPage";
import MemberDetails from "../pages/Members/MemberDetails";
import ChangePasswordPage from "../pages/Settings/ChangePasswordPage";
import UserProfilePage from "../pages/Profile/UserProfilePage";
import { useAppContext } from "../context/AppContext";
import SellerStripeSuccess from "../pages/Auth/SellerStripeSuccess";
import UserDetailsPage from "../pages/Wallet/UserDetailsPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";

const PrivateRoute = ({ element }) => {
  const token = Cookies.get("ownerToken") ? Cookies.get("ownerToken") : null;
  const { user } = useAppContext();

  // 1️⃣ Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // 2️⃣ Logged in but email not verified → verify otp
  if (token && user && user.emailVerified == false) {
    return <Navigate to="/verify-otp" replace />;
  }

  // 3️⃣ Logged in & email verified → allow access
  return element;
};

// --- Public Route ---
const PublicRoute = ({ element }) => {
  const token = Cookies.get("ownerToken") ? Cookies.get("ownerToken") : null;
  const { user } = useAppContext();

  // 1️⃣ Logged in & verified → dashboard
  if (token && user && user?.emailVerified == true) {
    return <Navigate to="/" replace />;
  }

  // 2️⃣ Logged in but not verified → verify otp
  if (token && user && user?.emailVerified == false) {
    return <Navigate to="/verify-otp" replace />;
  }

  // 3️⃣ Not logged in → allow
  return element;
};

// --- Routes ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />

      {/* --- AUTH FLOW --- */}
      <Route
        path="/signup"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <SignUpForm />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/verify-otp"
        element={
          <AuthLayout>
            <VerifyOtp />
          </AuthLayout>
        }
      />

      <Route
        path="/change-email"
        element={
          <AuthLayout>
            <ChangeEmailForm />
          </AuthLayout>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <PrivateRoute
            element={
              <AuthLayout>
                <CompleteProfileForm />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/seller/stripe/success"
        element={
          <PrivateRoute
            element={
              <AuthLayout>
                <SellerStripeSuccess />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/change-password"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <ChangePassword />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/add-payment-info"
        element={
          <PrivateRoute
            element={
              <AuthLayout>
                <AddPaymentInfo />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/payment-methods"
        element={
          <PrivateRoute
            element={
              <AuthLayout>
                <PaymentMethods />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/account-created"
        element={
          <PrivateRoute
            element={
              <AuthLayout>
                <AccountSuccessPage />
              </AuthLayout>
            }
          />
        }
      />

      {/* --- DASHBOARD ROUTES --- */}
      <Route
        path="/"
        element={
          <PrivateRoute element={<DashboardLayout pages={<HomePage />} />} />
        }
      />

      <Route
        path="/communities"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<CommunitiesPage />} />}
          />
        }
      />

      <Route
        path="/communities/details/:slug/:communityId"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<CommunityPage />} />}
          />
        }
      />

      <Route
        path="/products/:productId"
        element={
          <PrivateRoute element={<DashboardLayout pages={<ProductPage />} />} />
        }
      />

      <Route
        path="/communities/details/:communityId/member/:userId"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<MemberDetails />} />}
          />
        }
      />

      <Route
        path="/invites"
        element={
          <PrivateRoute element={<DashboardLayout pages={<InvitesPage />} />} />
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute element={<DashboardLayout pages={<ReportsPage />} />} />
        }
      />

      <Route
        path="/transaction-history"
        element={
          <PrivateRoute element={<DashboardLayout pages={<WalletPage />} />} />
        }
      />

      <Route
        path="/transaction-history/member/:userId"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<UserDetailsPage />} />}
          />
        }
      />

      <Route
        path="/settings/:settingsTab"
        element={
          <PrivateRoute
            element={
              <DashboardLayout
                pages={<SettingsLayout page={<ChangePasswordPage />} />}
              />
            }
          />
        }
      />

      {/* <Route
        path="/settings/change-password"
        element={
          <PrivateRoute
            element={
              <DashboardLayout
                pages={<SettingsLayout page={<ChangePasswordPage />} />}
              />
            }
          />
        }
      /> */}

      <Route
        path="/profile"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<UserProfilePage />} />}
          />
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute
            element={<DashboardLayout pages={<NotificationsPage />} />}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
