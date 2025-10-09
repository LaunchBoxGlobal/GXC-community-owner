import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

const isAuthenticated = () => !!Cookies.get("token");
const isEmailVerified = () => getUser()?.emailVerified;

export const PrivateRoute = ({ element }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
  }

  if (isAuthenticated() && !isEmailVerified()) {
    const fromPath = location.state?.from?.pathname || "/verify-otp";
    return <Navigate to={fromPath} replace />;
  }

  return element;
};

export const PublicRoute = ({ element, redirectTo }) => {
  const location = useLocation();
  const user = getUser();

  if (isAuthenticated() && user?.emailVerified) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return element;
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
