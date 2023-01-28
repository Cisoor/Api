import { getConnection } from "../database/database";
import { methods as serviceController } from "./service.controller";

const getCompanies = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM companies");
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getCompanyByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM services_has_companies INNER JOIN companies ON companies.idcompanies = services_has_companies.companies_idcompanies WHERE services_has_companies.services_idservices= ?",
      serviceId
    );
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(
      "SELECT * FROM companies WHERE companies.idcompanies= ?",
      id
    );
    const services = await connection.query(
      "SELECT * FROM services_has_companies INNER JOIN services ON services_has_companies.services_idservices=services.idservices WHERE services_has_companies.companies_idcompanies= ?",
      id
    );
    result[0].services = services;
    console.log(services);
    res.json(result[0]);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

export const methods = {
  getCompanies,
  getCompanyByService,
  getCompanyById,
};
