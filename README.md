# 📘 WOLTerWhite 📘

WOLTerWhite is an Advanced Programming course project. It seamlessly connects a modern React web dashboard to a high-performance C++ algorithmic recommendation engine via an intermediate Node.js/Express REST API gateway.

---

## 👥 Authors

- 👨‍💻 [Tal Tkhonov](https://github.com/TalTikho)
- 👨‍💻 [Yotam Harari Lifshits](https://github.com/yhtl350)
- 👨‍💻 [Liam Homay](https://github.com/LiamHomay)

---

## 🌿 Project Evolution & Milestones

| Branch | Exercise | Description |
| -------- | ---------- | ------------- |
| `finished-ex1` | Exercise 1 - Algorithmic Core | CLI recommendation system |
| `finished-ex2` | Exercise 2 - Networking Foundation | TCP client-server system (CPP & Python) |
| `finished-ex3` | Exercise 3 - API Gateway Layer | Node.js / Express web routing layer using an MVC architecture |
| `finished-ex4` | Exercise 4 - Frontend Web Application | Dynamic React UI with Context State Engines & Token Auth |

> ⚠️ **NOTE**: Do not modify `finished-ex1 / finished-ex2 / finished-ex3 / finished-ex4` branches after submission
> to preserve grace days.

---

## 🏗️ System Design & Structural Topology

1. **Dynamic React Frontend** (`/frontend`):

    Built as an interactive, web dashboard that handles content rendering conditionally based on user authentication vectors.

    - Global State Architecture: Leverages a unified React Context framework (`AuthContext, ThemeContext, RestaurantFilterContext, CardContext`) to avoid prop-drilling. State triggers propagate changes across the dashboard instantly.

    - Live Synchronization (Polling Engines): Features automated background data polling intervals to synchronize new catalog additions to the viewport without requiring manual page reloads.

    - Theme Controls: Integrates localized theme switching states mapped directly to custom CSS properties (Variables).

2. **Node.js REST API Gateway** (`/webServer`)

    Acts as the central router and data orchestrator, abstracting backend persistence mechanisms behind structured endpoints.

    - Architectural Pattern: Model-View-Controller (MVC).

    - Communication Pipelines: Instantiates and maintains a persistent TCP socket connection (`cppClient.js`) targeting the background C++ runtime.

    - In-Memory Store: Serves fast, isolated structural collections resetting dynamically across container deployment lifecycles for clean integration testing.

3. **High-Performance C++ Core** (`/src`)

    A native operational engine optimized for tracking data histories and serving product recommendations.

    - Persistent I/O Store: Commits analytics rows directly to disk within the filesystem volume (`data/`).

    - Command Dispatch Processor: Runs custom request parsers supporting `POST, PATCH, and DELETE` commands to process analytical vectors.

---

## 📂 Project Directory Structure

```PlainText
.
├── src/                  # 🖥️ Native C++ Engine Architecture
│   ├── client/           # Legacy client hooks
│   ├── include/          # Header Declarations
│   └── source/           # Core Algorithmic implementations
│
├── webServer/            # 🌐 Node.js / Express REST Engine (MVC)
│   ├── controllers/      # Logic Handlers (Auth, Restaurants, Orders)
│   ├── models/           # Structural In-Memory Entity Schemas
│   ├── routes/           # Express REST Endpoints
│   └── cppClient.js      # Persistent TCP Socket Manager
│
├── frontend/             # 🎨 React Web Application
│   ├── public/           # Visual Media Components & Logos
│   ├── src/
│   │   ├── components/   # Reusable Viewports (Navbar, Cards, BG)
│   │   ├── context/      # Global State Engines (Auth, Filters)
│   │   ├── hooks/        # Custom Function Librarie (useSound)
│   │   ├── pages/        # Primary App Components (Home, Login)
│   │   └── services/           
│   └── package.json
│
├── data/                 # 💾  C++ Output Volume
├── docker-compose.yml    # Microservice Orchestration
├── CMakeLists.txt        # C++ Build Configuration
└── README.md
```

---

## 🛠️ Deployment & Execution Quickstart

### Option A: Fully Containerized Stack (Production Test)

Ensure Docker Desktop is active, clone the codebase, and boot the multi-tier container configuration:

```bash
git clone https://github.com/TalTikho/wolterwhite
cd wolterwhite
docker-compose up --build
```

Once initialized, access your live local instances:

- Frontend Site Application: `http://localhost:3000`
- Backend API Gateway: `http://localhost:5000`

### Option B: Optimized Hybrid Layout (Recommended for Frontend Devs)

After clonning the repository, To enable instantaneous Hot Module Replacement (HMR) and immediate viewport compilation without rebuilding full containers on every layout modification open **TWO** terminals:

1. Spin up your backend infrastructure via Docker:

    ```bash
    # (Terminal I)
    docker compose up --build wolterwhite-server wolterwhite-web
    ```

2. Configure your localized environmental target: Create a .env file within your `frontend/` subdirectory:

    ```bash
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```

3. Install dependencies and launch the local React compiler engine:

    ```bash
    # Move into the frontend folder (Terminal II)
    cd frontend

    # Install the required modules listed in package.json
    npm install

    # Run the app in development mode at http://localhost:3000
    npm start
    ```

> ⚠️ **NOTE**: To  shut down the docker/web, in each terminal press `ctrl c` until you are back to the regular wsl line. Then `docker-compose down`

---

### 📝 Technical Implementation Details

- Authentication Protocol: JSON Web Tokens (JWT) handled via cryptographically encoded base64 payloads parsed client-side inside standard Context layers.

- Audio Layer: Integrates highly contextual layout interactions leveraging internal event hooks (`useSound()`) to fire custom media files based on runtime statuses.

- Docker Port Mapping: Dev servers map runtime boundaries utilizing `ALLOWED_HOSTS=all` parameters to let external routing structures cross-communicate inside development configurations safely.

- Design Principles: Strict alignment with **SOLID** principles and isolated, decoupled module design patterns.

---

### ⏯️ Examples

#### Home Page after login as Admin

![homePage](./media/homePageLoginAdmin.png)

#### Admin Page

![adminPage](./media/adminPageDarkMode.png)

#### Creating new restaurant

![newRestaurant](./media/newRestaurantLightMode.png)

#### Restaurant was created

![showingRestaurant](./media/showingRestaurants.png)

#### Creating new Product

![newProduct](./media/newProductDarkMode.png)

#### Optional filtering

![optionalFiltering](./media/optionalFiltering.png)

#### Home page With the Restaurants

![homeWithRestaurants](./media/homePageWithRestaurantsDarkMode.png)

#### Restaurant Page

![restaurant](./media/restaurantPageLightMode.png)

#### Order Page

![orderPage](./media/orderPageLightMode.png)

#### Order ordered Page

![orderOrderedPage](./media/orderedOrdersLightMode.png)

#### Restaurant as Quick View

![quickView](./media/restaurantQuickViewLightMode.png)

#### Regular User Login

![regularUserLogin](./media/loginRegularUserLightMode.png)

#### Regular User Home Page

![regularUserLogin](./media/regularUserHomePage.png)

#### Starting and Closing

![docker-compose_up_--build](./media/docker-compose_up_--build.png)
![docker-compose_down](./media/docker-compose_down.png)

---

### 📄 License

- This project was developed as part of an advanced systems programming assignment
