import toast from "react-hot-toast";
import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKay = "loggedInUser";
  const userDataString = localStorage.getItem(storageKay);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const onLogOut = () => {
    localStorage.removeItem("loggedInUser");
    toast.success("you will navigate to login page after 2", {
      position: "bottom-center",
      duration: 1500,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "fit-content",
      },
    });
    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20  px-3 py-3 rounded-md ">
      <ul className="flex items-center justify-between">
        <li className="duration-200 text-lg font-semibold">
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? (
          <div className="flex items-center space-x-4 ">
            <li className=" duration-200 text-lg font-semibold">
              <NavLink
                to="/todos"
                className={"p-2 rounded-md duration-200 text-lg"}
              >
                todos
              </NavLink>
            </li>
            <li className=" duration-200 text-lg font-semibold">
              <NavLink
                to="/profile"
                className={"p-2 rounded-md duration-200 text-lg"}
              >
                profile
              </NavLink>
            </li>
            <Button className="cursor-pointer" size={"sm"} onClick={onLogOut}>
              logout
            </Button>
          </div>
        ) : (
          <p className="flex items-center space-x-4">
            <li className=" duration-200 text-lg font-semibold">
              <NavLink to="/login">Login</NavLink>
            </li>
            <li className=" duration-200 text-lg font-semibold">
              <NavLink to="/Register">Register</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
