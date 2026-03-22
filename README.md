# 🎮 Moon Lander (Playdate Style)

A classic Lunar Lander game reimagined with the unique 1-bit aesthetic of the Playdate handheld console. Navigate your lander through challenging lunar terrain, manage your fuel, and achieve a safe landing.

## ✨ Features

*   **1-bit Visuals:** Experience a high-contrast, black and green visual style inspired by the Playdate. No anti-aliasing, transparencies, or gradients – just sharp edges and dithered patterns.
*   **Realistic Physics Simulation:**
    *   Moon gravity affecting vertical velocity.
    *   Thrust based on fuel consumption and lander angle.
    *   Rotation control for precise maneuvering.
*   **Dynamic Lunar Terrain:** Randomly generated terrain with flat landing zones.
*   **Fuel Management:** Keep an eye on your fuel levels; running out means a crash!
*   **Safety Checks:** Land safely within specified velocity and angle limits.
*   **HUD (Heads-Up Display):** Monitor your height, distance, vertical velocity, horizontal velocity, fuel, and angle.
*   **Game States:** Clear feedback for starting, playing, zooming, landed, crashed, and out of fuel.
*   **Easter Egg:** Discover a special landing spot!

## 🚀 How to Play

**Objective:** Safely land your lunar module on the moon's surface.

**Controls:**

*   `ArrowUp`: Apply thrust (consumes fuel).
*   `ArrowLeft`: Rotate lander left (consumes fuel).
*   `ArrowRight`: Rotate lander right (consumes fuel).
*   `R`: Restart the game from any end state or the start screen.

**Landing Conditions:**

*   **Safe Landing:**
    *   Vertical speed within safe limits (`CONFIG.MAX_SAFE_VERTICAL_VELOCITY`).
    *   Horizontal speed within safe limits (`CONFIG.MAX_SAFE_HORIZONTAL_VELOCITY`).
    *   Lander angle close to vertical (`CONFIG.MAX_SAFE_ANGLE`).
*   **Crash:**
    *   Exceeding safe speeds or angles upon impact.
*   **Out of Fuel:** Unable to control the lander.

## 🛠️ Running Locally

To run this game on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Super Mario # Or your project root directory
    ```
2.  **Serve the files:** You need a simple local HTTP server.
    *   **Using Python (Recommended):**
        ```bash
        python -m http.server 8000
        ```
    *   **Using Node.js (if you have `npx`):**
        ```bash
        npx serve . -p 8000
        ```
3.  **Open in Browser:** Once the server is running, open your web browser and navigate to `http://localhost:8000`.

## 📂 Project Structure

```
Super Mario/ (Project Root)
├── index.html          // Main game page
├── style.css           // Basic styling
├── script.js           // Core game logic, physics, and rendering
├── config.js           // Game configuration parameters (gravity, fuel, safe landing values, etc.)
├── assets/             // (Optional) Image and sound assets
│   ├── images/
│   └── sounds/
├── gamedesign.md       // Detailed game design document (Playdate style guide)
├── plan.md             // Original development plan
└── README.md           // This file
```

## 📄 Version History

*   `0.0.2`:
    *   Fixed `ReferenceError: verticalVelocity is not defined`.
    *   Updated McDonald's icon to 'M'.
