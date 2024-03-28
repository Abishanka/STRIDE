
# STRIDE (Strategic Training and ROTC Information Data Entry)

Welcome to STRIDE, a comprehensive tool designed to assist the University of Florida ROTC during field training exercises. STRIDE aims to streamline data entry and management, making it easier for instructors and cadets to organize and access critical information efficiently.

## Getting Started

To get STRIDE up and running on your machine, follow these steps:

### Setup Frontend

Navigate to the frontend directory by entering `cd ./electron/frontend` in your terminal.

Install dependencies and run the development server by entering `npm install` followed by `npm run serve`.

### Running STRIDE

After setting up the frontend, you have two options to run STRIDE:

#### Electron Window
Open a new terminal window, navigate to the electron folder by entering `cd ../` (only if you're still in the frontend directory) followed by `cd ./electron/`, and start the Electron application by entering `npx electron .`. This will open STRIDE in an Electron window, providing a desktop application experience.

#### Web Browser
Alternatively, you can access STRIDE through your web browser by navigating to `http://localhost:8080/`. This method allows you to run STRIDE without needing to open it as a desktop application.