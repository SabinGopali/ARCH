import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fromLearnMore = localStorage.getItem("fromLearnMore");

    if (hash && fromLearnMore === "true") {
      // Scroll to the element smoothly
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      localStorage.removeItem("fromLearnMore");
    } else {
      // Scroll top on refresh or normal navigation

      // Remove the hash from URL so browser does not jump there automatically
      if (hash) {
        navigate(pathname, { replace: true });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash, navigate]);

  return null;
}
