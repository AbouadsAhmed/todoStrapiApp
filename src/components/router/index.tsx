import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ProtectedRoute from "../auth/ProtectRout";
import PageNotFound from "../pages/PageNotFound";
import RootLayout from "../pages/Layout";
import ErrorHandler from "../error/ErrorHandler";
import HomePage from "../pages";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import TodoPage from "../pages/TodoPage";
const storageKay = "loggedInUser";
const userDataString = localStorage.getItem(storageKay);
const userData = userDataString ? JSON.parse(userDataString) : null;
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root Layout */}
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        <Route
          index
          element={
            <ProtectedRoute
              isAllowed={userData?.jwt}
              redirectPath="/login"
              data={userData}
            >
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute
              isAllowed={userData?.jwt}
              redirectPath="/login"
              data={userData}
            >
              <h2>profile</h2>
            </ProtectedRoute>
          }
        />
        <Route
          path="todos"
          element={
            <ProtectedRoute
              isAllowed={userData?.jwt}
              redirectPath="/login"
              data={userData}
            >
              <TodoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <ProtectedRoute
              isAllowed={!userData?.jwt}
              redirectPath="/"
              data={userData}
            >
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="register"
          element={
            <ProtectedRoute
              isAllowed={!userData?.jwt}
              redirectPath="/login"
              data={userData}
            >
              <RegisterPage />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Page Not Found */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);
export default router;
