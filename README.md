# Stardog Visualization

`stardogvisualization` is a React-based application that fetches data from a Stardog endpoint and provides a mechanism to query and filter the data for visualization purposes.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Using the Application](#using-the-application)
  - [Querying Data](#querying-data)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)

## Installation

To get started, clone this repository and install the necessary dependencies.


git clone https://github.com/your-username/stardogvisualization.git
cd stardogvisualization
npm install

## Configuration

The project requires configuration for accessing the Stardog endpoint. The following information needs to be placed in the `config.js` file, which is located in the root directory.

export const STARDOG_URL = "your_stardog_url_here";
export const STARDOG_USERNAME = "your_username_here";
export const STARDOG_PASSWORD = "your_password_here";

## Running the Project

After setting up the configuration, you can start the application using the following command:

npm start


This will start the development server, and you can view the application in your browser at `http://localhost:3000`.

## Using the Application

Once the application is running, it will fetch data from the Stardog endpoint and store it in memory. The data is represented as a set of triples (subject, predicate, object). By default, no data will be displayed until a query is made.

### Querying Data

To query the data:

1. **Input Field**: There is a query input box where you can type a search term. The input box filters the data dynamically as you type.
   - You can query based on **subject**, **predicate**, or **object** values.
   - For example, typing `Person` will return all triples where the subject, predicate, or object contains "Person".

2. **Data Display**: Once you begin typing, the filtered results will be displayed below the query box.
   - If no data matches the query, a "No data found" message will appear.
   - If there is an error connecting to the Stardog endpoint, an error message will be displayed.

## Project Structure

Here is an overview of the key files and directories in this project:

- `stardogvisualization/`
  - `public/` - Public assets (HTML, favicon, etc.)
  - `src/`
    - `components/`
      - `DataList.js` - Displays the filtered data
      - `QueryInput.js` - Handles the query input
      - `useFetchData.js` - Custom hook for fetching Stardog data
    - `App.js` - Main application component
    - `config.js` - Configuration for Stardog credentials and URL
  - `package.json` - Project dependencies and scripts
  - `README.md` - Project documentation

## Dependencies

The project relies on the following dependencies:

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making requests to the Stardog endpoint.
- **Redux**: (Included but not yet used) A predictable state container for JavaScript applications.
- **react-redux**: Official React bindings for Redux (included but not yet used).
- **react-scripts**: Required for running and building the app (part of Create React App).

To install these dependencies, simply run `npm install`.

