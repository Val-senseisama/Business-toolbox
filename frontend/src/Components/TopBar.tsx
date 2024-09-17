import logo from "../assets/images/business-toolbox-icon.png";

const TopBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom  p-3 mb-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center w-100 justify-content-start px-5 py-3">
          <img src={logo} alt="Business ToolBox" className="img-fluid " />
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
