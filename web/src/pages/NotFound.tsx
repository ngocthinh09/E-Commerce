import { Link } from "react-router";
import Header from "../components/Header";


function NotFound() {
  return (
    <>
      <Header />
      <div className="text-center mt-25 font-sans">
        <div className="text-[30px] font-bold mb-5">404 - Page not found</div>
        <p>We're sorry, the page you looking for doesn't exist.</p>
        <Link to="/">
          <div className="text-teal-700 underline text-[18px] mt-2.5">Back to HomePage</div>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
