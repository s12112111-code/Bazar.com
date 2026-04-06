# Books Bazar - Distributed Systems Labs

This repository contains the implementation of **Books Bazar**, a microservices-based online bookstore application. The project is implemented using Docker and Node.js.

## Authors

**Yousef Salman & Ibrahim Tayeh**

---

## 🏗️ Project Architecture Overview

The system simulates an e-commerce platform where users can:

* **Search** for books by topic.
* **View** detailed information about a book.
* **Purchase** books (updating stock).

### Core Services:

1. **Frontend Service** → Handles client requests and acts as a gateway.
2. **Catalog Service** → Manages books (ID, title, topic, price, stock).
3. **Order Service** → Handles purchase transactions.

---

## 🔌 Services & Ports (Current Implementation)

| Service          | Host Port | Description                         |
| ---------------- | --------- | ----------------------------------- |
| Frontend Service | `3000`    | Entry point for all client requests |
| Catalog Service  | `3001`    | Manages book data                   |
| Order Service    | `3002`    | Handles purchase operations         |

---

## 🚀 Running the Project

1. Navigate to project folder:

```bash
cd bazar
```

2. Run Docker:

```bash
docker compose up --build
```

3. Make sure all services are running:

```bash
docker ps
```

You should see:

* frontend-service (port 3000)
* catalog-service (port 3001)
* order-service (port 3002)

---

## 📜 API Reference

All requests go through the **Frontend Service**:

Base URL:

```
http://localhost:3000
```

---

### 🔍 Search Books

```
GET /search/<topic>
```

Example:

```
http://localhost:3000/search/distributed%20systems
```

---

### 📘 Get Book Info

```
GET /info/<id>
```

Example:

```
http://localhost:3000/info/1
```

---

### 🛒 Purchase Book

```
POST /purchase/<id>
```

Example:

```
http://localhost:3000/purchase/1
```

---

## ⚙️ Internal Service Communication

Inside Docker, services communicate using **service names (NOT localhost)**:

* Frontend → Catalog:

```
http://catalog-service:3001
```

* Frontend → Order:

```
http://order-service:3002
```

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* Docker & Docker Compose
* SQLite

---

## ⚠️ Common Issues & Fixes

### 1. Catalog service unavailable

**Cause:**
Frontend is using `localhost` instead of service name.

**Fix:**
Use:

```
http://catalog-service:3001
```

---

### 2. sqlite3 invalid ELF header

**Cause:**
node_modules installed on Windows but used in Linux container.

**Fix:**

```bash
docker compose down
rm -rf node_modules
docker compose up --build
```

---

## 🧪 Testing the System

You can test using:

* Browser
* Postman

Make sure:

* All services are running
* Correct ports are used
* Docker containers are healthy

---

## 📝 Notes

* The system follows a **microservices architecture**.
* Frontend acts as a **gateway** between client and services.
* Services communicate internally using Docker network.

---

