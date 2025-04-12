import { NavLink } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { FaThList } from "react-icons/fa";

function BottomNavbar() {
  const navLinks = [
    {
      label: "Home",
      icon: <FaUser />,
      link: "/"
    },
    {
      label: "Promos",
      icon: <FaThList />,
      link: "/promos"
    }
  ];

  const renderNavLinks = navLinks.map((item) => {
    return (
      <NavLink key={item.label} to={item.link}>
        {({isActive}) => (isActive ?
          <div className={`flex flex-col items-center justify-center text-white`}>
            <div className="bg-neutral-700 rounded-full h-7 flex items-center justify-center px-4 text-xl">
              {item.icon}
            </div>
            <span className="text-xs">{item.label}</span>
          </div>
          :
          <div className={`flex flex-col items-center justify-center text-neutral-400`}>
            <div className="h-7 flex items-center justify-center px-4 text-xl">
              {item.icon}
            </div>
            <span className="text-xs">{item.label}</span>
          </div>
        )}
      </NavLink>
    )
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-800 p-2">
      <div className="flex items-center justify-evenly">
        {renderNavLinks}
      </div>
    </nav>
  )
}

export default BottomNavbar