import { Link } from "react-router-dom";
import "../css/module.css";

const CompanyModule = ({
  id,
  src,
  name,
  add
}: {
  id: number;
  src: string;
name: string;
  add?: boolean; // to add a company, set this to true, otherwise false (default)
}) => {
  return (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
      <Link to={add?'/create-company' : `/company/${id}`}>
        <div className="company-card py-5 px-5 mx-3">
          <img src={src} alt={`${name} logo`} className="company-logo" />
          <h3 className="company-name">{name}</h3>
        </div>
      </Link>
    </div>
  );
};

export default CompanyModule;
