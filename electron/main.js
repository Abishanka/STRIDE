const { app, ipcMain, BrowserWindow } = require("electron");
const sqlite3 = require("sqlite3");
const path = require("node:path");

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
      contextIsolation: true,
      preload: path.join(__dirname, "frontend/src/preload.js"),
    },
  });

  // Load the Vue app
  // If using Vue CLI 3/4, by default it will be served on localhost:8080
  win.loadURL("http://localhost:8080");
}

function generate_platoons(cadets, cadets_per_platoon) {
  numPlatoons = Math.ceil(cadets.length / cadets_per_platoon);
  platoons = [];
  for (let i = 0; i < numPlatoons; ++i) {
    platoons.push([]);
  }

  let currentPlat = 0;
  for (let i = 0; i < cadets.length; ++i) {
    if (currentPlat == numPlatoons) {
      currentPlat = 0;
    }

    platoons[currentPlat].push(cadets[i]);
    currentPlat++;
  }

  return platoons;
}

function generateSquads(platoons, cadets_per_squad) {
  let platoonsWithSquads = [];

  for (let i = 0; i < platoons.length; ++i) {
    numSquads = Math.ceil(platoons[i].length / cadets_per_squad);
    squads = [];
    for (let j = 0; j < numSquads; ++j) {
      squads.push([]);
    }

    let currentSquad = 0;
    for (let j = 0; j < platoons[i].length; ++j) {
      if (currentSquad == numSquads) {
        currentSquad = 0;
      }

      squads[currentSquad].push(platoons[i][j]);
      currentSquad++;
    }

    platoonsWithSquads.push(squads);
  }

  return platoonsWithSquads;
}

function generateWaterfallData(
  event,
  ftx_length,
  cadets_per_platoon,
  missions_per_day,
  cadets_per_squad,
  cadets
) {
  const platoons = generate_platoons(cadets, cadets_per_platoon);
  const platoonsWithSquads = generateSquads(platoons, cadets_per_squad);

  let leadership = [];

  let duplicates = false;
  for (p = 0; p < platoons.length; ++p) {
    let PLs = [];
    let PSGs = [];
    let SLs = [];

    let assigned = [];
    for (let day = 0; day < ftx_length; ++day) {
      for (mission = 0; mission < missions_per_day; ++mission) {
        let currentSLs = [];
        for (squad = 0; squad < platoonsWithSquads[p].length; ++squad) {
          let cadetIndex = 0;
          while (
            SLs.includes(platoonsWithSquads[p][squad][cadetIndex].uid) ||
            (!duplicates &&
              assigned.includes(platoonsWithSquads[p][squad][cadetIndex].uid))
          ) {
            ++cadetIndex;
            if (cadetIndex >= platoonsWithSquads[p][squad].length) {
              cadetIndex = Math.floor(
                Math.random() * platoonsWithSquads[p][squad].length
              );
              break;
            }
          }
          currentSL = platoonsWithSquads[p][squad][cadetIndex];
          SLs.push(currentSL.uid);
          currentSLs.push(currentSL.uid);
          //add squad leader position
          leadership.push({
            cadet: currentSL.uid,
            position: "SL",
            day: day,
            mission: mission,
          });
          assigned.push(currentSL.uid);
        }
        //Select PL
        cadetIndex = 0;
        while (
          currentSLs.includes(platoons[p][cadetIndex].uid) ||
          PLs.includes(
            platoons[p][cadetIndex].uid ||
              (!duplicates && assigned.includes(platoons[p][cadetIndex].uid))
          )
        ) {
          ++cadetIndex;
          if (cadetIndex >= platoons[p].length) {
            cadetIndex = Math.floor(Math.random() * platoons[p].length);
            break;
          }
        }
        currentPL = platoons[p][cadetIndex];
        PLs.push(currentPL.uid);
        //add PL
        leadership.push({
          cadet: currentPL.uid,
          position: "PL",
          day: day,
          mission: mission,
        });
        assigned.push(currentPL.uid);
        //Select PSG
        cadetIndex = 0;
        while (
          currentSLs.includes(platoons[p][cadetIndex].uid) ||
          PSGs.includes(platoons[p][cadetIndex].uid) ||
          currentPL.uid == platoons[p][cadetIndex].uid ||
          (!duplicates && assigned.includes(platoons[p][cadetIndex].uid))
        ) {
          ++cadetIndex;
          if (cadetIndex >= platoons[p].length) {
            cadetIndex = Math.floor(Math.random() * platoons[p].length);
            break;
          }
        }
        currentPSG = platoons[p][cadetIndex];
        PSGs.push(currentPSG.uid);
        //add PSG
        leadership.push({
          cadet: currentPSG.uid,
          position: "PSG",
          day: day,
          mission: mission,
        });
        assigned.push(currentPSG.uid);

        if (assigned.length == platoons[p].length) {
          duplicates = true;
        }
      }
    }
  }

  event.sender.send("receive-waterfall-data", {
    platoons: platoonsWithSquads,
    leadership: leadership,
  });
}

function getWaterfallData(
  event,
  ftx_length,
  cadets_per_platoon,
  missions_per_day,
  cadets_per_squad
) {
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
      //console.log("Waterfall Data:", cadets);
      generateWaterfallData(
        event,
        ftx_length,
        cadets_per_platoon,
        missions_per_day,
        cadets_per_squad,
        cadets
      );
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}

function updateCadetProfile(event, newValues, cadetId) {
  const columnsToUpdate = Object.keys(newValues)
    .map((column) => `${column} = ?`)
    .join(", ");
  const values = Object.values(newValues);

  db.run(
    `UPDATE CadetProfile SET ${columnsToUpdate} WHERE uid = ${cadetId}`,
    values,
    function (err) {
      if (err) {
        event.sender.send("profile-update-status", err.message);
        console.error("Error updating row:", err.message);
      } else {
        event.sender.send("profile-update-status", "success");
        console.log(`Row updated: ${this.changes} row(s) affected`);
      }
    }
  );
}

function insertBlueCard(event, blueCardData) {
  const columns = Object.keys(blueCardData).join(", ");
  const placeholders = Object.keys(blueCardData)
    .map(() => "?")
    .join(", ");
  const values = Object.values(blueCardData);

  const sql = `INSERT INTO BlueCards (${columns}) VALUES (${placeholders})`;
  console.log(sql);
  db.run(sql, values, function (err) {
    if (err) {
      event.sender.send("submission-status", err.message);
      console.error("Error inserting row:", err.message);
    } else {
      event.sender.send("submission-status", "success");
      console.log(`Row inserted with ID: ${this.lastID}`);
    }
  });
}

function insertCadetProfiles(event, cadetDataList) {
  const placeholders = cadetDataList.map(() => "(?, ?, ?)").join(", ");
  const values = cadetDataList.flatMap((cadet) => Object.values(cadet));

  const sql = `INSERT INTO CadetProfile (first_name, last_name, school) VALUES ${placeholders}`;

  db.run(sql, values, function (err) {
    if (err) {
      event.sender.send("cadet-upload-status", err.message);
      console.error("Error inserting rows:", err.message);
    } else {
      event.sender.send("cadet-upload-status", "success");
      console.log(`${this.changes} row(s) inserted`);
    }
  });
}

function addCadet(event, data) {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const values = Object.values(blueCardData);

  const sql = `INSERT INTO CadetProfile (${columns}) VALUES (${placeholders})`;

  db.run(sql, values, function (err) {
    if (err) {
      event.sender.send("submission-status", err.message);
      console.error("Error inserting row:", err.message);
    } else {
      event.sender.send("add-cadet-status", "success");
      console.log(`Row inserted with ID: ${this.lastID}`);
    }
  });
}

function getMatchingCadets(event, name) {
  db.all(
    "SELECT * FROM CadetProfile WHERE first_name || ' ' || last_name LIKE ? || '%'",
    [name],
    (err, rows) => {
      if (err) {
        console.error("Error selecting data:", err.message);
      } else {
        event.sender.send("matching-cadets", rows);
      }
    }
  );
}

function getUniqueSchools(event) {
  // SELECT DISTINCT school FROM CadetProfile
  const sql = "SELECT DISTINCT school FROM BlueCards";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching unique schools:", err.message);
    } else {
      event.sender.send("unique-schools", rows);
    }
  });
}

function getOverallAssessmentBySchool(event, school) {
  // SELECT overall_assessment, count(*) FROM
  // (SELECT overall_assessment FROM BlueCards WHERE school = "MNO School")
  const sql = `
    SELECT overall_assessment, count(*) as count FROM
    (SELECT overall_assessment FROM BlueCards WHERE school = ?) 
    GROUP BY overall_assessment
  `;

  db.all(sql, [school], (err, rows) => {
    if (err) {
      console.error(
        "Error fetching overall assessment data by school:",
        err.message
      );
    } else {
      event.sender.send("overall-assessment-data", rows);
    }
  });
}

function getSustainBySchool(event, school) {
  // SELECT sustain, count(*) from
  // (SELECT sustain1 AS sustain FROM BlueCards WHERE school = "ABC High School"
  // UNION ALL
  // SELECT sustain2 AS sustain FROM BlueCards WHERE school = "ABC High School"
  // UNION ALL
  // SELECT sustain3 AS sustain FROM BlueCards WHERE school = "ABC High School")
  // GROUP BY sustain
  const sql = `
    SELECT sustain, count(*) as count FROM
    (
      SELECT sustain1 AS sustain FROM BlueCards WHERE school = ?
      UNION ALL
      SELECT sustain2 AS sustain FROM BlueCards WHERE school = ?
      UNION ALL
      SELECT sustain3 AS sustain FROM BlueCards WHERE school = ?
    )
    GROUP BY sustain
  `;

  db.all(sql, [school, school, school], (err, rows) => {
    if (err) {
      console.error("Error fetching sustain data by school:", err.message);
    } else {
      event.sender.send("sustain-data", rows);
    }
  });
}

function getImproveBySchool(event, school) {
  const sql = `
    SELECT improve, count(*) as count FROM
    (
      SELECT improve1 AS improve FROM BlueCards WHERE school = ?
      UNION ALL
      SELECT improve2 AS improve FROM BlueCards WHERE school = ?
      UNION ALL
      SELECT improve3 AS improve FROM BlueCards WHERE school = ?
    )
    GROUP BY improve
  `;

  db.all(sql, [school, school, school], (err, rows) => {
    if (err) {
      console.error("Error fetching improve data by school:", err.message);
    } else {
      event.sender.send("improve-data", rows);
    }
  });
}

function getUniqueCadets(event) {
  // SELECT DISTINCT school FROM CadetProfile
  const sql =
    "SELECT DISTINCT uid, first_name, last_name FROM CadetProfile ORDER BY last_name";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching unique schools:", err.message);
    } else {
      event.sender.send("unique-cadets", rows);
    }
  });
}

function getOverallAssessmentByCadet(event, cadetId) {
  // SELECT overall_assessment, count(*) FROM
  // (SELECT overall_assessment FROM BlueCards WHERE school = "MNO School")
  const sql = `
    SELECT overall_assessment, count(*) as count FROM
    (SELECT overall_assessment FROM BlueCards WHERE uid = ?) 
    GROUP BY overall_assessment
  `;
  console.log("WE READ " + cadetId);

  db.all(sql, [cadetId], (err, rows) => {
    if (err) {
      console.error(
        "Error fetching overall assessment data by school:",
        err.message
      );
    } else {
      console.log("SENT OVERALL ASSESSMENT CADET DATA");
      console.log(rows);
      event.sender.send("overall-assessment-cadet-data", rows);
    }
  });
}

function getSustainByCadet(event, cadetId) {
  // SELECT sustain, count(*) from
  // (SELECT sustain1 AS sustain FROM BlueCards WHERE school = "ABC High School"
  // UNION ALL
  // SELECT sustain2 AS sustain FROM BlueCards WHERE school = "ABC High School"
  // UNION ALL
  // SELECT sustain3 AS sustain FROM BlueCards WHERE school = "ABC High School")
  // GROUP BY sustain
  const sql = `
    SELECT sustain, count(*) as count FROM
    (
      SELECT sustain1 AS sustain FROM BlueCards WHERE uid = ?
      UNION ALL
      SELECT sustain2 AS sustain FROM BlueCards WHERE uid = ?
      UNION ALL
      SELECT sustain3 AS sustain FROM BlueCards WHERE uid = ?
    )
    GROUP BY sustain
  `;

  db.all(sql, [cadetId, cadetId, cadetId], (err, rows) => {
    if (err) {
      console.error("Error fetching sustain data by cadet:", err.message);
    } else {
      event.sender.send("sustain-cadet-data", rows);
    }
  });
}

function getImproveByCadet(event, cadetId) {
  const sql = `
    SELECT improve, count(*) as count FROM
    (
      SELECT improve1 AS improve FROM BlueCards WHERE uid = ?
      UNION ALL
      SELECT improve2 AS improve FROM BlueCards WHERE uid = ?
      UNION ALL
      SELECT improve3 AS improve FROM BlueCards WHERE uid = ?
    )
    GROUP BY improve
  `;

  db.all(sql, [cadetId, cadetId, cadetId], (err, rows) => {
    if (err) {
      console.error("Error fetching improve data by cadet:", err.message);
    } else {
      event.sender.send("improve-cadet-data", rows);
    }
  });
}

function allBluecards(event) {
  const sql =
    "SELECT * FROM BlueCards JOIN CadetProfile on BlueCards.uid = CadetProfile.uid ORDER BY school";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error:", err.message);
    } else {
      event.sender.send("all-bluecards", rows);
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

ipcMain.on("get-waterfall-data", (event, args) => {
  info = getWaterfallData(
    event,
    args.ftxLength,
    args.cadetsPerPlatoon,
    args.missionsPerDay,
    args.cadetsPerSquad
  );
});

ipcMain.on("get-unique-schools", (event) => {
  getUniqueSchools(event);
});

ipcMain.on("get-overall-assessment-by-school", (event, args) => {
  getOverallAssessmentBySchool(event, args);
});

ipcMain.on("get-sustain-by-school", (event, args) => {
  console.log(args);
  getSustainBySchool(event, args);
});

ipcMain.on("get-improve-by-school", (event, args) => {
  console.log(args);
  getImproveBySchool(event, args);
});

ipcMain.on("get-unique-cadets", (event) => {
  getUniqueCadets(event);
});

ipcMain.on("get-overall-assessment-by-cadet", (event, args) => {
  getOverallAssessmentByCadet(event, args);
});

ipcMain.on("get-sustain-by-cadet", (event, args) => {
  console.log(args);
  getSustainByCadet(event, args);
});

ipcMain.on("get-improve-by-cadet", (event, args) => {
  console.log(args);
  getImproveByCadet(event, args);
});

ipcMain.on("edit-cadet-profile", (event, args) => {
  newValues = args.newValues.changes;
  cadetId = args.id;
  updateCadetProfile(event, newValues, cadetId);
});

ipcMain.on("upload-blue-card", (event, args) => {
  console.log(args);
  insertBlueCard(event, args);
});

ipcMain.on("upload-cadet-profiles", (event, args) => {
  cadetData = args; //update as needed
  insertCadetProfiles(event, cadetData);
});

ipcMain.on("get-matching-cadets", (event, args) => {
  getMatchingCadets(event, args);
});

ipcMain.on("add-cadet", (event, args) => {
  addCadet(args);
});

ipcMain.on("export-bluecards", (event, args) => {
  allBluecards(event);
});
