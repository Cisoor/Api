import { getConnection } from "../database/database";

const getUsers = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM users");
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getUseryEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM users WHERE users.email= ?",
      email
    );
    res.json(result);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT * FROM users WHERE users.idusers= ?",
      id
    );
    res.json(result[0]);
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name == undefined || email == undefined || password == undefined) {
      res.status(400).json({ message: "Los campos no estan completos" });
    }

    const user = { name, email, password };
    const connection = await getConnection();
    const result = await connection.query("INSERT INTO users SET ?", user);
    //ENVIAR CORREO DE REGISTRO EXITOSO
    ////////////////////////////////////////////////////////
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, lastname, phone } = req.body;
    if (name == undefined || lastname == undefined || phone == undefined) {
      res.status(400).json({ message: "Los campos no estan completos" });
    }
    const user = { name, lastname, phone };
    const connection = await getConnection();
    const result = await connection.query(
      "UPDATE users SET name='" +
        name +
        "',lastname='" +
        lastname +
        "',phone='" +
        phone +
        "' WHERE users.idusers=" +
        req.params.id
    );
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status("500");
    res.send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email == undefined || password == undefined) {
      res.status(400).json({ message: "Los campos no estan completos" });
    }
    const connection = await getConnection();
    const query =
      "SELECT * FROM users INNER JOIN rols_has_users ON rols_has_users.users_idusers=users.idusers WHERE users.email='" +
      email.toString() +
      "'" +
      " AND users.password = '" +
      password +
      "'";
    const result = await connection.query(query);
    console.log(result);
    if (result.length != 0) {
      res.json(result[0]);
    } else {
      res.status(500);
      res.json({ message: "Datos incorrectos, o usuario no encontrado" });
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const methods = {
  getUsers,
  registerUser,
  getUseryEmail,
  login,
  updateUser,
  getUserById,
};
