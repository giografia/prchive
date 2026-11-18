import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useLayoutEffect, useRef, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "./AppLayout.css";

const tabs = [
  { to: "/split", label: "Split" },
  { to: "/log", label: "Log" },
  { to: "/progress", label: "Progress" },
  { to: "/subscription", label: "Subscription" },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const placedOnce = useRef(false);
  const [pill, setPill] = useState(null);

  useLayoutEffect(() => {
    function place() {
      const active = navRef.current?.querySelector(".nav-tab.active");
      if (!active) {
        //if no tab matches, hide the button
        setPill((prev) => prev && { ...prev, visible: false });
        return;
      }
      setPill({
        x: active.offsetLeft,
        y: active.offsetTop,
        w: active.offsetWidth,
        h: active.offsetHeight,
        visible: true,
        animate: placedOnce.current, // first placement snaps into place, others slide
      });
      placedOnce.current = true;
    }
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place); //re-measure after fonts are loaded
    return () => window.removeEventListener("resize", place);
  }, [pathname]);

  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo-link" aria-label="PRchive home">
          <Logo />
        </Link>
        <nav className="app-nav" ref={navRef}>
          <span
            className={"nav-pill" + (pill?.animate ? " animate" : "")}
            aria-hidden="true"
            style={
              pill
                ? {
                    width: pill.w,
                    height: pill.h,
                    transform: `translate(${pill.x}px, ${pill.y}px)`,
                    opacity: pill.visible ? 1 : 0,
                  }
                : { opacity: 0 }
            }
          />
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                "nav-tab" + (isActive ? " active" : "")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
