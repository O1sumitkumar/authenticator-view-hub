// import { useAuth as useOidcAuth } from "react-oidc-context";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export const useAuth = () => {
//   const { isAuthenticated, isLoading, signinRedirect, signoutRedirect, user } =
//     useOidcAuth();
//   const authState = useSelector((state: RootState) => state.auth);

//   return {
//     isAuthenticated,
//     isLoading,
//     login: () => signinRedirect(),
//     logout: () => signoutRedirect(),
//     token: user?.access_token,
//     userData: authState.userData,
//     hasRole: (roles: string | string[]) => {
//       if (!user || !isAuthenticated) {
//         return false;
//       }
//     },
//   };
// };

// export default useAuth;
