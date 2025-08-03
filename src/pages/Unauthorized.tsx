import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { signoutRedirect } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg mb-6">
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Dashboard
          </Button>
          <Button onClick={() => signoutRedirect()} variant="destructive">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
