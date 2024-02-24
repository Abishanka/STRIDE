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
  const blueCardData = {
    cid: 1,
    uid: 1,
    event: "Event Name",
    leadership_pos: "Leadership Position",
    // Add other fields and values as needed
  };

  insertBlueCard(blueCardData);
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

function updateCadetProfile(newValues, cadetId) {
  const columnsToUpdate = Object.keys(newValues)
    .map((column) => `${column} = ?`)
    .join(", ");
  const values = Object.values(newValues);

  db.run(
    `UPDATE CadetProfile SET ${columnsToUpdate} WHERE uid = ${cadetId}`,
    values,
    function (err) {
      if (err) {
        console.error("Error updating row:", err.message);
      } else {
        console.log(`Row updated: ${this.changes} row(s) affected`);
      }
    }
  );
}

function insertBlueCard(blueCardData) {
  const columns = Object.keys(blueCardData).join(", ");
  const placeholders = Object.keys(blueCardData)
    .map(() => "?")
    .join(", ");
  const values = Object.values(blueCardData);

  const sql = `INSERT INTO BlueCards (${columns}) VALUES (${placeholders})`;

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Error inserting row:", err.message);
    } else {
      console.log(`Row inserted with ID: ${this.lastID}`);
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

//example use:  updateCadetProfile({ first_name: "newName", school: "newSchool" }, 2);
app.on("edit-cadet-profile", (newValues, cadetId) => {
  updateCadetProfile(newValues, cadetId);
});

/*Example use:
const blueCardData = {
  cid: 1,
  uid: 1,
  event: 'Event Name',
  leadership_pos: 'Leadership Position',
  // Add other fields and values
};
*/
insertBlueCard(blueCardData);
app.on("upload-blue-card", (blueCardInfo) => {
  insertBlueCard(blueCardInfo);
});
