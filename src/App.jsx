import AuthProvider from "./context/AuthContext";
import AllRoutes from "./routes/AllRoutes";

export default function App() {
  return (
    <>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </>
  );
}