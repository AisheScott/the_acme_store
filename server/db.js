const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgresql://postgres:Kortney11@localhost:5432/acme_reservation_db"
);

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS favorite;
        DROP TABLE IF EXISTS product;
        DROP TABLE IF EXISTS user;

        CREATE TABLE user(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE product(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL, 
        );

        CREATE TABLE favorite(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES product(id) NOT NULL,
            CONSTRAINT unique_user_skill UNIQUE (user_id, product_id)
        );
    `;

  await client.query(SQL);
};

const createProduct = async (name) => {
    const SQL = `INSERT INTO skills(id, name) VALUES($1,$2) RETURNING *;`;
  
    const response = await client.query(SQL, [uuid.v4(), name]);
  
    return response.rows[0];
  };

  const createUser = async (name, password) => {
    const SQL = `INSERT INTO users(id, name, password) VALUES($1, $2, $3) RETURNING *;`;
    const hashed_password = await bcrypt.hash(password, 5);
  
    const response = await client.query(SQL, [uuid.v4(), name, hashed_password]);
  
    return response.rows[0];
  };
  
  const fetchProducts = async () => {
    const SQL = `SELECT * from products;`;
  
    const response = await client.query(SQL);
  
    return response.rows;
  };

  const fetchUsers = async () => {
    const SQL = `SELECT * from users;`;
  
    const response = await client.query(SQL);
  
    return response.rows;
  };

  const createFavorite = async (user_id, product_id) => {
    const SQL = `INSERT INTO Favorite(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *;`;
  
    const reponse = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  
    return reponse.rows[0];
  }; 

  const fetchFavorite = async (user_id) => {
    const SQL = `SELECT * from user_skills WHERE user_id = $1;`;
  
    const response = await client.query(SQL, [user_id]);
  
    return response.rows;
  };
  
  const destroyFavorite = async (id, user_id) => {
    const SQL = `DELETE FROM Products WHERE id = $1 AND user_id = $2`;
  
    await client.query(SQL, [id, user_id]);
  };



  module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorite,
    destroyFavorite,
  };

