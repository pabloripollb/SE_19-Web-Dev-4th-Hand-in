**Project for the SE_19 Web Technologies Basics course.**

This repository contains the code for the 4th Hand-in, a full-stack Node.js application.
The web structure was built from a Figma desing I made, adapted to CSS rules. It fulfills all the requirements of the lasts hand-ins too. 
Besides this piece of text all the rest of the README file was made with AI.

## 🚀 Features

* **Public-Facing Site:**
    * Dynamic pages for Home, Services, Pricing, Blog, and Contact.
    * Serves static assets (CSS, images) from the `public` folder.
* **Admin Panel:**
    * Secure admin login (`admin_login.ejs`).
    * Protected dashboard (`admin_panel.ejs`) for managing site content.
    * Content editing/creation page (`admin_edit.ejs`).
* **Templating:** Uses EJS as the view engine to render dynamic HTML on the server.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **View Engine:** EJS (Embedded JavaScript)
* **Styling:** Custom CSS
* **Deployment:** Render.com

## ⚙️ Running the Project Locally

**Prerequisites:** You must have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd KORVAD
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the project root and add the following variables:
    ```
    DATABASE_URL=...
    SESSION_SECRET=...
    ADMIN_PASSWORD=...
    ```

4.  **Run the Server**
    ```bash
    node server.js
    ```
    The application will be available at `http://localhost:3000` (or as specified in your `.env`).

---

### Self-Reflection Statement

This project was an exercise in building a full-stack Node.js application from a Figma design. The primary focus was creating a server-side rendered (SSR) site using Express and EJS, moving from a static HTML/CSS build to a dynamic one.

The backend is built to handle routing for both the public-facing pages and a protected admin panel, which uses session-based authentication to secure the admin routes. While AI was used as a tool to help scaffold the backend logic and bridge the gap from a static to a dynamic site, the process highlighted the complexities of authentication, templating, and managing environment secrets. The main challenge was understanding how these backend components (routes, sessions, and EJS rendering) interact to deliver a final HTML page to the user.