import { getConnection } from "../database/database";

const getBookings = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM bookings");
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getBookingActiveByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(
      "SELECT * FROM bookings INNER JOIN companies ON companies.idcompanies = bookings.companies_idcompanies WHERE bookings.user_id= ? AND bookings.state='Aceptado'",
      id
    );
    if (result.length != 0) {
      let services = await connection.query(
        "SELECT * FROM services INNER JOIN services_has_bookings ON services_has_bookings.services_idservices = services.idservices INNER JOIN bookings ON bookings.idbookings=services_has_bookings.bookings_idbookings INNER JOIN services_has_companies ON services_has_companies.companies_idcompanies = bookings.companies_idcompanies WHERE services_has_bookings.bookings_idbookings = ? GROUP BY services.idservices;",
        result[0].idbookings
      );
      result[0].services = services;
      let total = 0;
      services.forEach((service) => {
        total = total + service["value"];
      });
      result[0]["total"] = total;
      res.json(result[0]);
    } else {
      res.json({ message: "No tiene ningun servicio activo" });
    }
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const updateBookingByWorker = async (req, res) => {
  try {
    const { worker_id, state } = req.body;
    if (worker_id == undefined) {
      res.status(400).json({ message: "Los campos no estan completos" });
    }
    const connection = await getConnection();
    const resultget = await connection.query(
      "SELECT * FROM rols_has_users WHERE rols_idrols = 3 AND users_idusers = " +
        worker_id
    );
    if (resultget.length != 0) {
      const result = await connection.query(
        "UPDATE bookings SET worker_id='" +
          worker_id +
          "', state='" +
          state +
          "'"
      );
      res.json({ message: "Reserva actualizada correctamente" });
    } else {
      res.json({
        message: "El usuario que esta aceptando no tiene rol de empleado",
      });
    }
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      date,
      payment_type,
      user_id,
      worker_id,
      companies_idcompanies,
      ratings_idratings,
    } = req.body;

    if (
      date == undefined ||
      user_id == undefined ||
      companies_idcompanies == undefined
    ) {
      res.status(400).json({ message: "Los campos no estan completos" });
    }

    const booking = {
      date,
      payment_type,
      user_id,
      worker_id,
      companies_idcompanies,
      ratings_idratings,
    };
    const connection = await getConnection();
    booking.state = "Created";
    //Validate if user have one booking active
    const resultGet = await connection.query(
      "SELECT * FROM bookings  WHERE bookings.user_id = " +
        user_id +
        " AND bookings.state = 'Created';"
    );
    if (resultGet.length == 0) {
      const result = await connection.query(
        "INSERT INTO bookings SET ?",
        booking
      );
      //Notificar aca a los usuarios de esa empresa
      /////////////////////////////////////////////
      res.json({ message: "Reserva creada correctamente" });
    } else {
      res.json({ message: "Ya tiene una reserva activa este usuario." });
    }
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getBookingsByCompany = async (req, res) => {
  try {
    const { id, state } = req.params;
    const connection = await getConnection();
    let result = await connection.query(
      "SELECT bookings.*,companies.*,users.name AS userName FROM bookings INNER JOIN companies ON companies.idcompanies = bookings.companies_idcompanies INNER JOIN users ON users.idusers = bookings.user_id WHERE bookings.companies_idcompanies= ? AND bookings.state='" +
        state +
        "'",
      id
    );
    if (result.length != 0) {
      await result.forEach(async (booking) => {
        let total = 0;
        let services = await connection.query(
          "SELECT  DISTINCT  * FROM services INNER JOIN services_has_bookings ON services_has_bookings.services_idservices = services.idservices INNER JOIN bookings ON bookings.idbookings=services_has_bookings.bookings_idbookings INNER JOIN services_has_companies ON services_has_companies.companies_idcompanies = bookings.companies_idcompanies WHERE services_has_bookings.bookings_idbookings = ? GROUP BY services.idservices;",
          booking.idbookings
        );
        booking.services = services;
        services.forEach((service) => {
          total = total + service["value"];
        });
        booking.total = total;
      });
      setTimeout(() => {
        res.json(result);
      }, 1000);
    }
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getBookingsByWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    let result = await connection.query(
      "SELECT bookings.*,companies.*,users.name AS userName FROM bookings INNER JOIN companies ON companies.idcompanies = bookings.companies_idcompanies INNER JOIN users ON users.idusers = bookings.user_id WHERE bookings.worker_id= ? AND bookings.state='Aceptado'",
      id
    );
    if (result.length != 0) {
      await result.forEach(async (booking) => {
        let total = 0;
        let services = await connection.query(
          "SELECT  DISTINCT  * FROM services INNER JOIN services_has_bookings ON services_has_bookings.services_idservices = services.idservices INNER JOIN bookings ON bookings.idbookings=services_has_bookings.bookings_idbookings INNER JOIN services_has_companies ON services_has_companies.companies_idcompanies = bookings.companies_idcompanies WHERE services_has_bookings.bookings_idbookings = ? GROUP BY services.idservices;",
          booking.idbookings
        );
        booking.services = services;
        services.forEach((service) => {
          total = total + service["value"];
        });
        booking.total = total;
      });
      setTimeout(() => {
        res.json(result);
      }, 1000);
    }
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

export const methods = {
  getBookings,
  createBooking,
  updateBookingByWorker,
  getBookingActiveByUser,
  getBookingsByCompany,
  getBookingsByWorker,
};
