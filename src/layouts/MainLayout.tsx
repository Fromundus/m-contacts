import { Outlet, useLocation } from "react-router-dom"
import SearchContactInput from "../components/SearchContactInput"
import BottomNavbar from "../components/BottomNavbar";

const MainLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/search"];
  const dynamicRoutes = ["/search", "/contact"];

  const shouldHideNavbar =
  hideNavbarRoutes.includes(location.pathname) || 
  dynamicRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="p-4 bg-neutral-900 min-h-[100svh] w-full text-neutral-100">
      {!shouldHideNavbar && <header>
        <SearchContactInput type="home" />
      </header>}
      <main>
        <Outlet
          context={{
          }}
        />
      </main>
      {!shouldHideNavbar && <BottomNavbar />}
    </div>
  )
}

export default MainLayout
