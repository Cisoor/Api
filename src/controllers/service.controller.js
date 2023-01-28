import { getConnection } from "../database/database";

const getServices = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM services");
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getServicesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM services_has_companies INNER JOIN services ON services_has_companies.services_idservices=services.idservices WHERE services_has_companies.companies_idcompanies= ?",
      companyId
    );
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getServicesById = async (req, res) => {
  try {
    const { companyId, serviceId } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM services INNER JOIN services_has_companies ON services_has_companies.services_idservices=services.idservices WHERE services.idservices= " +
        serviceId +
        " AND services_has_companies.companies_idcompanies=" +
        companyId
    );
    res.json(result[0]);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

export const methods = {
  getServices,
  getServicesByCompany,
  getServicesById,
};
