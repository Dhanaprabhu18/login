// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");

// const app = express();

// app.use(cors());
// app.use(express.json());

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,

//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// pool.connect()
// .then(() => {
//     console.log("Connected to Neon PostgreSQL");
// })
// .catch((err) => {
//     console.log(err);
// });

// app.listen(process.env.PORT, () => {
//     console.log("Server Running");
// });


// app.post("/api/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const result = await pool.query(
//       "SELECT * FROM login WHERE username=$1 AND password=$2",
//       [username, password]
//     );

//     if (result.rows.length > 0) {
//       res.json({
//         success: true,
//         message: "Login Successful",
//       });
//     } else {
//       res.json({
//         success: false,
//         message: "Invalid Username or Password",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// ==============================
// Middleware
// ==============================

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// ==============================
// Neon PostgreSQL Connection
// ==============================

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test Database Connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Neon PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  }
})();

// ==============================
// Home API
// ==============================

app.get("/", (req, res) => {
  res.send("🚀 Backend Running Successfully");
});

// ==============================
// Login API
// ==============================

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password Required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM login WHERE username=$1 AND password=$2",
      [username.trim(), password.trim()]
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: "Login Success",
      });
    }

    return res.json({
      success: false,
      message: "Wrong Username or Password",
    });

  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==============================
// Get All Login Users
// ==============================

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username FROM login ORDER BY username"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ==============================
// Add User
// ==============================

app.post("/api/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    await pool.query(
      "INSERT INTO login(username,password) VALUES($1,$2)",
      [username.trim(), password.trim()]
    );

    res.json({
      success: true,
      message: "User Saved Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ==============================
// Delete User
// ==============================

app.delete("/api/users/:username", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM login WHERE username=$1",
      [req.params.username]
    );

    res.json({
      success: true,
      message: "User Deleted",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});
