import { useEffect, useState } from "react";
import { getAllServices } from "../../services/CityService";

import Card from "../common/Card";
import Table from "../common/Table";

const CityManagement = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await getAllServices();
    setServices(data);
  };

  return (
    <>
      <h1>City Information Management</h1>
      <p className="muted">
        Inventory of public services and infrastructure
      </p>

      <Card>
        <Table data={services} />
      </Card>
    </>
  );
};

export default CityManagement;