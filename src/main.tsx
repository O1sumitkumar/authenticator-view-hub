import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXhfcXRRR2RfU0ZxXEFWYEE=")

createRoot(document.getElementById("root")!).render(<App />);
