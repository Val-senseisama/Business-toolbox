import { Link } from "react-router-dom";
import "../css/module.css";

const ActivityModule = ({
  module,
  src,
    name,
  text,
  companyId,
}: {
  module: String;
  src: string;
        name: string;
    text?: string;
  companyId: number;
}) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-12 mb-4">
      <Link to={`/company/${module}/${companyId}`}>
        <div className="module-card flex-grow-1 py-3 px-3 mx-2">
          <img src={src} alt={`${name} logo`} className="company-logo" />
                  <h3 className="my-3">{name}</h3>
                  <p className="fw-400">{text}</p>
        </div>
      </Link>
    </div>
  );
};

export default ActivityModule;
