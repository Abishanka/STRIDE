const { app, BrowserWindow } = require("electron");
const sqlite3 = require("sqlite3");

const DB_PATH = "database/stride.db";

//window var
let win;

//connect to db
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the Vue app
  // If using Vue CLI 3/4, by default it will be served on localhost:8080
  win.loadURL("http://localhost:8080");
}

function getWaterfallData() {
  //var to hold cadet info: uid, first_name, last_name, school
  let cadets;

  const getCadetData = new Promise((resolve, reject) => {
    db.all(
      "SELECT uid, first_name, last_name, school FROM CadetProfile ORDER BY school",
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });

  Promise.all([getCadetData])
    .then(([cadetRows]) => {
      cadets = cadetRows;
      console.log("Waterfall Data:", cadets);
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}

function getCadetProfile(cadetId) {
  db.all("SELECT * FROM CadetProfile WHERE uid = ?", [cadetId], (err, rows) => {
    if (err) {
      console.error("Error selecting data:", err.message);
    } else {
      if (rows.length > 0) {
        console.log("Cadet data:", rows[0]);
      } else {
        console.log("Cadet with ID", cadetId, "not found.");
      }
    }
  });
}

app.whenReady().then(createWindow);

// Close the database connection
app.on("before-quit", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Closed the SQLite database connection.");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("get-waterfall-data", () => {
  getWaterfallData();
});

app.on("get-cadet-profile", (cadetId) => {
  getCadetProfile(cadetId);
});
