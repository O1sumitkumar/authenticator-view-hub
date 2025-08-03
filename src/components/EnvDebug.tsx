import React from 'react';

const EnvDebug = () => {
  return (
    <div className="p-4 m-4 bg-gray-100 dark:bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold mb-2">Environment Variables Debug</h2>
      
      <h3 className="font-semibold mt-2">import.meta.env:</h3>
      <pre className="text-sm overflow-auto">
        {JSON.stringify(
          {
            MODE: import.meta.env.MODE,
            VITE_KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
            VITE_KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
            VITE_KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            VITE_API_URL: import.meta.env.VITE_API_URL,
            VITE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
            VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
          },
          null,
          2
        )}
      </pre>
      
      <h3 className="font-semibold mt-4">process.env:</h3>
      <pre className="text-sm overflow-auto">
        {JSON.stringify(
          {
            NODE_ENV: process.env.NODE_ENV,
            VITE_KEYCLOAK_URL: process.env.VITE_KEYCLOAK_URL,
            VITE_KEYCLOAK_REALM: process.env.VITE_KEYCLOAK_REALM,
            VITE_KEYCLOAK_CLIENT_ID: process.env.VITE_KEYCLOAK_CLIENT_ID,
            VITE_API_URL: process.env.VITE_API_URL,
            VITE_DEBUG_MODE: process.env.VITE_DEBUG_MODE,
            VITE_LOG_LEVEL: process.env.VITE_LOG_LEVEL,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default EnvDebug; 