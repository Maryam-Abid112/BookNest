
import Navbar from "@/Components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body><Navbar/>{children}</body>
    </html>
  );
}
