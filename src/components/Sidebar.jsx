import React from "react";
import { links } from "../data/dummy";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      <div className="flex justify-between items-center">Grand Atma Hotel</div>

      <div className="mt-10">
        {links.map((item) => (
          <div key={item.title}>
            <p className="text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
            {item.links.map((link) => (
              <NavLink
                to={`/${link.name}`}
                key={link.name}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
