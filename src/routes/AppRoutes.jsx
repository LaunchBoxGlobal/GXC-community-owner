import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";
import SignUpForm from "../components/Forms/SignUpForm";
import VerifyOtp from "../components/Forms/VerifyOtp";
import AddPaymentInfo from "../components/Forms/AddPaymentInfo";
import PaymentMethods from "../pages/PaymentMethods";
import AccountSuccessPage from "../pages/Auth/AccountSuccessPage";
import HomePage from "../pages/Home/HomePage";
import LoginForm from "../components/Forms/LoginForm";
import VerifyEmail from "../components/Forms/VerifyEmail";
import ChangePassword from "../components/Forms/ChangePassword";
import Cookies from "js-cookie";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CommunitiesPage from "../pages/Communities/CommunitiesPage";
import UserProfilePage from "../pages/Profile/UserProfilePage";
import SettingsLayout from "../components/Layout/SettingsLayout";
import ChangePasswordPage from "../pages/Settings/ChangePasswordPage";
import CompleteProfileForm from "../components/Forms/CompleteProfileForm";
import CommunityPage from "../pages/Communities/CommunityPage";
import ProductPage from "../pages/Communities/ProductPage";
import InvitesPage from "../pages/Invites/InvitesPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import WalletPage from "../pages/Wallet/WalletPage";
import MemberDetails from "../pages/Members/MemberDetails";

const getUser = () => {
  const userCookie = Cookies.get("user");
  return userCookie ? JSON.parse(userCookie) : null;
};

const isAuthenticated = () => !!Cookies.get("token");
const isEmailVerified = () => {
  const user = getUser();
  return user?.emailVerified === true;
};

// ✅ Route Guards
export const PrivateRoute = ({ element, redirectTo = "/login" }) => {
  const auth = isAuthenticated();
  const verified = isEmailVerified();

  // not logged in → go to login
  if (!auth) return <Navigate to={redirectTo} replace />;

  // logged in but not verified → go to verify-otp
  if (auth && !verified) return <Navigate to="/verify-otp" replace />;

  return element; // ok
};

export const PublicRoute = ({ element, redirectTo = "/" }) => {
  const auth = isAuthenticated();
  const verified = isEmailVerified();

  // logged in and verified → go to home/dashboard
  if (auth && verified) return <Navigate to={redirectTo} replace />;

  // logged in but not verified → go to verify-otp
  if (auth && !verified) return <Navigate to="/verify-otp" replace />;

  return element; // public route ok
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route
        path="/signup"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <SignUpForm />
              </AuthLayout>
            }
            redirectTo="/"
          />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute
            redirectTo={`/`}
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
            redirectTo={`/`}
            element={
              <AuthLayout>
                <ChangePassword />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/verify-otp"
        element={
          // isUnverified() ? (
          <AuthLayout>
            <VerifyOtp />
          </AuthLayout>
          // ) : (
          // <Navigate to="/" />
          // )
        }
      />

      <Route
        path="/complete-profile"
        element={
          <PrivateRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <CompleteProfileForm />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/add-payment-info"
        element={
          <PrivateRoute
            redirectTo={`/login`}
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
            redirectTo={`/login`}
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
            redirectTo={`/`}
            element={
              <AuthLayout>
                <AccountSuccessPage />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<HomePage />} />}
          />
        }
      />
      <Route
        path="/communities"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<CommunitiesPage />} />}
          />
        }
      />
      <Route
        path="/communities/details/:slug"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<CommunityPage />} />}
          />
        }
      />

      <Route
        path="/products/:productId"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<ProductPage />} />}
          />
        }
      />

      {/* <Route
        path="/members"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<MembersPage />} />}
          />
        }
      /> */}
      <Route
        path="/communities/details/:communityId/member/:userId"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<MemberDetails />} />}
          />
        }
      />

      <Route
        path="/invites"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<InvitesPage />} />}
          />
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<ReportsPage />} />}
          />
        }
      />

      <Route
        path="/wallet"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<WalletPage />} />}
          />
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <DashboardLayout
                pages={<SettingsLayout page={<ChangePasswordPage />} />}
              />
            }
          />
        }
      />

      <Route
        path="/settings/change-password"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <DashboardLayout
                pages={<SettingsLayout page={<ChangePasswordPage />} />}
              />
            }
          />
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={<DashboardLayout pages={<UserProfilePage />} />}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
