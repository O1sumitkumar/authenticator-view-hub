import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import KeycloakProvider from "./lib/auth/KeycloakProvider";
import ProtectedRoute from "./lib/auth/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./pages/Dashboard";
import Users from "./pages/Users";
import Codes from "./pages/Codes";
import UserDetail from "./pages/UserDetail";
import Security from "./pages/Security";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import { Applications } from "./pages/Applications";
import { Rights } from "./pages/Rights";
import { Accounts } from "./pages/Accounts";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const User = () => {
  return (
    <div>
      <h1>User</h1>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
};

const ActivityPage = () => {
  return (
    <div>
      <h1>Activity</h1>
    </div>
  );
};

const UserDetailPage = () => {
  return (
    <div>
      <h1>User Detail</h1>
    </div>
  );
};

const CodesPage = () => {
  return (
    <div>
      <h1>Codes</h1>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <KeycloakProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="users/:id" element={<UserDetail />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="rights" element={<Rights />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="codes" element={<Codes />} />
                    <Route
                      path="security"
                      element={
                        <ProtectedRoute
                          requiredRoles={["admin", "security-admin"]}
                        >
                          <Security />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="activity" element={<Activity />} />
                    <Route
                      path="settings"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </KeycloakProvider>
    </PersistGate>
  </Provider>
);

export default App;
