import { Link } from "react-router";
import "./NotFound.css";

export default function NotFound() {
  return (
    <>
      <p className="page-eyebrow">404</p>
      <h1 className="page-title">Page not found</h1>
      <Link to="/split" className="notfound-link">
        Back to Split
      </Link>
    </>
  );
}
