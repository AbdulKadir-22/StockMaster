# StockMaster Frontend Documentation

## 1\. Project Overview

StockMaster is a modern **Inventory Management System** designed to streamline warehouse operations. The frontend is built as a Single Page Application (SPA) that interacts with a backend API to manage products, stock movements (receipts/deliveries), and reporting.

## 2\. Technology Stack

  * **Framework:** React 18
  * **Build Tool:** Vite
  * **Routing:** React Router DOM (v6)
  * **HTTP Client:** Axios
  * **Styling:** Standard CSS (Modular approach with CSS Variables)
  * **Utilities:** `date-fns` (Date formatting), `react-icons` (Iconography)

## 3\. Project Structure

The project follows a feature-based and scalable folder structure:

```text
src/
├── components/
│   ├── layout/       # Global layout components (AppShell, Sidebar)
│   └── ui/           # Reusable UI primitives (Button, Input, Select, Table)
├── context/          # Global state management (AuthContext)
├── lib/              # Library configurations (Axios instance)
├── pages/            # Page-level components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductsList.jsx
│   ├── ProductCreate.jsx
│   ├── ReceiptCreate.jsx
│   ├── DeliveryCreate.jsx
│   ├── Ledger.jsx
│   └── Profile.jsx
├── services/         # API service layers (Auth, Product, Dashboard, etc.)
├── utils/            # Helper functions (Formatters)
└── App.jsx           # Main routing configuration
```

## 4\. Setup & Installation

### Prerequisites

  * Node.js (v16 or higher)
  * NPM or Yarn
  * A running instance of the StockMaster Backend

### Installation Steps

1.  **Clone the repository** (if applicable) or navigate to the project folder.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the root directory (you can copy `.env.example`).
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```
    *Ensure this URL matches your backend server address.*

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173`.

## 5\. Application Features & Workflows

### A. Authentication

  * **Login/Register:** Users can sign in or create an account. The `AuthContext` manages the user session using JWT tokens stored in `localStorage`.
  * **Route Protection:** The `AppShell` component guards protected routes, redirecting unauthenticated users to the Login page.

### B. Dashboard

  * **Overview:** Displays key metrics: Total Products, Low Stock count, Pending Receipts, and Pending Deliveries.
  * **Recent Activity:** A quick view of the latest stock movements.
  * **Quick Actions:** Shortcuts to create products or transactions.

### C. Product Management

  * **List View:** View all inventory items with search functionality and pagination.
  * **Stock Status:** Visual indicators for "Low Stock" vs "In Stock".
  * **Create Product:** Form to add new items with SKU, Category, and Reorder Levels.

### D. Transactions (Stock Movement)

  * **Receipts (Inbound):** Record goods arriving from suppliers. Users can add multiple line items (Product + Quantity).
  * **Deliveries (Outbound):** Record goods shipped to customers. Includes stock availability checks in the UI.

### E. Stock Ledger

  * **History:** A complete audit trail of every movement (Receipt, Delivery, Adjustment).
  * **Filters:** Filter by operation type (e.g., show only Receipts).
  * **Visuals:** Color-coded quantity changes (Green for positive, Red for negative).

### F. User Profile

  * **Personal Info:** View and edit basic user details (Name, Phone).
  * **Security:** Update password functionality.
  * **Logout:** Securely clears the session and redirects to Login.

## 6\. Key Components & Services

### Core UI Components (`src/components/ui/`)

  * **Button:** Supports variants (`primary`, `secondary`, `danger`) and loading states.
  * **Input / Select:** Standardized form controls with error handling.
  * **Table:** A clean, responsive data table wrapper.

### API Services (`src/services/`)

  * **api.js:** Central Axios instance. Handles request interception (attaching tokens) and response interception (unwrapping data or handling global errors like 401).
  * **auth.service.js:** Login, Register, Get Current User.
  * **product.service.js:** CRUD operations for inventory.
  * **dashboard.service.js:** Aggregated stats for the home screen.
  * **ledger.service.js:** Fetching historical data.

## 7\. Troubleshooting Common Issues

  * **"Auth Initialization FAILED" / Infinite Login Loop:**

      * Check the browser console.
      * Verify the `VITE_API_BASE_URL` is correct.
      * Ensure the backend is running and the `/auth/login` endpoint is accessible.
      * Check if the token format (Bearer) matches backend expectations.

  * **Dashboard Loading Indefinitely:**

      * This often means the API call to `/dashboard/summary` failed silently or the Auth Context is stuck. Ensure the `AppShell` is properly wrapping the routes in `App.jsx`.

  * **Styles Not Applying:**

      * Verify that `src/index.css` is imported in `src/main.jsx`.
      * Check that CSS variables (colors/fonts) are defined in the `:root` block of `index.css`.