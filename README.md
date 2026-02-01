# ⚡ GamerVault | Command Center

GamerVault is an elite hardware management platform designed with a Cyberpunk aesthetic. It allows **Pilots** (customers) to configure their dream "Rig" and **Commanders** (administrators) to manage shipping logistics in real-time.

---

## 🚀 Technologies Used

This project was built under a high-performance environment:
* **Vite**: Ultra-fast build tool.
* **Yarn**: Efficient package manager.
* **JavaScript (ES6+)**: Pure logic for state management.
* **CSS3**: Neon aesthetics with custom variables and animations.
* **HTML5**: Semantic structure.

---

## 🛠️ Installation and Setup

To get the system running in your local environment, follow these steps:

1.  **Install dependencies:**
    ```bash
    yarn
    ```

2.  **Start the development server:**
    ```bash
    yarn dev
    ```

3.  **Generate production build:**
    ```bash
    yarn build
    ```

---

## 📖 Main Features

### 1. Role-Based Access System
* **Pilot (User):** Access to the store and personal profile management.
* **Commander (Admin):** Access to the **Admin Hub** for total control of global orders.

### 2. Rig Configuration (Shopping Cart)
* Catalog featuring 9 elite components.
* Automatic **14% VAT (IVA)** calculation.
* Technological auditory feedback for every interaction.
* Dynamic, collapsible side panel.

### 3. Advanced Profile Management
* **Custom Avatar:** Upload photos directly from your computer.
* **Shipping & Payment:** Secure storage of shipping addresses and payment methods (VISA/Mastercard).

### 4. Real-Time Logistics
* Administrators can update orders to the following statuses: `Preparing`, `Shipped`, or `Delivered`.
* Customers can track their hardware's progress from their personal history.

---

## ⚙️ Internal Mechanics

The system utilizes `localStorage` to simulate a persistent database:
* **currentUser**: Stores the active session and profile data.
* **orders**: Saves the complete transaction history, including profile pictures and logistic statuses at the time of purchase.
* **FileReader API**: Used to process local user images without the need for a backend server.



---

## 🎨 Visual Aesthetics
* **Color Palette:** Neon Cyan (#00f3ff) and Neon Magenta (#ff00ff).
* **Typography:** Inter / Sans-serif for maximum technical readability.
* **Interactivity:** Entrance animations (SlideUp) and hover effects on hardware components.

---

**Developed under the high-performance Vite + Yarn protocol.**