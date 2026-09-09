
import Navbar from "@/Components/Navbar";
import { AuthProvider } from "../context/Authcontext";
import "bootstrap/dist/css/bootstrap.min.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" >
      <body>
       <AuthProvider>
        <Navbar/>
          {children}
        </AuthProvider></body>
    </html>
  );
}
