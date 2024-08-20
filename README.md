# Contacts App

## Backend

Built using Laravel. Please refer to composer.json for dependency requirements.

### Database

App is using a simple SQLite database. We have one table for **contacts** and one to hold updates to contacts, named **contact_histories**.

### API

The API provides all required CRUD operations for Contact model. Plus, it has an endpoint to fetch the history for a specific contact.
Accessible through localhost:8000/api

### Broadcasting

The app utilizes Pusher to broadcast Contact updates to the frontend. Please make sure Pusher configuration is correct in .env file.

### Tests

There are some tests available under /Tests for both Contact model and the API.

## Frontend

Built with React. Please refer to package.json for dependency requirements. Accessible through localhost:3000.

### ContactList

All contacts are fetched by default during initial load. For each contact, first name, last name, email and phone number is displayed. There are three actions available for each contact: update, see history or delete.

Update action turns selected contact view into a form for editing.
See History action lists all previous versions of selected contact with update dates.
Delete action deletes selected contact.

### Live updates

The app can listen to ContactUpdated and ContactDeleted events fired by backend. Please make sure Pusher configurations are correct. Whenever an event is received, the app automatically updates the recently updated contact to display the current and correct data of that contact.


## Running locally via Docker

To run the app via docker, just do:
- docker-compose up -build

## Running locally

An executable script is provided to run the app locally. Please make sure you have the required PHP and Node versions installed in your system.

To run the app, just do:
- set DB_DATABASE as "${PWD}/knot" in .env
- chmod +x run_local.sh
- ./run_local.sh


