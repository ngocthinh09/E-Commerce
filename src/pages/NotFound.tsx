import type { CSSProperties } from "react";
import { Link } from "react-router";
import Header from "../components/Header";


function NotFound() {
  const containerStyle: CSSProperties = {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Roboto, Arial, sans-serif",
  };

  const messageStyle: CSSProperties = {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px"
  };

  const linkStyle: CSSProperties = {
    color: "rgb(0, 113, 133)",
    textDecoration: "underline",
    fontSize: "18px",
    marginTop: "10px"
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={messageStyle}>404 - Page not found</div>
        <p>We're sorry, the page you looking for doesn't exist.</p>
        <Link to="/">
          <div style={linkStyle}>Back to HomePage</div>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
