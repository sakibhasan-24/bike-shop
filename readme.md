# Bike-Shop API

## Overview

The **Bike-Shop API** is a backend application for a bike shop API that allows to browse and purchase bikes. The API is built using **Typescript**, **Mongoose**, , **Node.js**,, **Express**, and **Eslint**. The application is deployed on **Vercel**.

---

## Features

- Browse available bikes
- Create A bike
- Get Bike
- Admin panel for bike management

---

## Tech Stack

### Backend

- **Node.js**
- **Express.js** (with TypeScript)
- **MongoDB** (via Mongoose)
- **dotenv** (for environment variable management)
- **ESLint** (for code quality and consistency)

### Deployment

- Hosted on **Vercel**

---

## Setup Instructions

### Prerequisites

- **Node.js**
- **MongoDB**
- **npm**
- **Typescript**

### Installation

- install dependencies

```
npm install
```

- run the application

```
npm run dev
```

---

## API Endpoints

### GET /bikes

- **Description**: Fetches all available bikes,also add search query.
- **Response**: An array of bike objects.

### POST /bikes

- **Description**: Creates a new bike.
- **Request Body**: A JSON object containing bike details.

### Delete /bikes

- **Description**: Apply soft delete method.
- **Response **: A JSON object containing details.

### Update/bikes

- **Description**: Update Bike Information and store it.
- **Response **: A JSON object containing details.

### POST/Orders

- **Description**:create a new order based on logical scenario in Bike Model.
- **Response**: An array of Order objects.

### GET/Orders/revenue

- **Description**:apply aggregation pipeline for Know total revenue from orders.
- **Response**: An array of Order objects with total revenueR.
