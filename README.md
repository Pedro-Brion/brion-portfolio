# Boid Simulation Portfolio

Welcome to my Boid Simulation Portfolio, a creative and interactive web experience designed to showcase my front-end development skills. I built this project using **Vue.js** and **Three.js**, featuring a real-time boid simulation running in the background. You can see it live here:

[BrionDev](https://briondev.com)

This portfolio aims to showcase my personal and profissional work, and serves as a demonstration of my technical skils. The boid simulation that runs on the background highlights my passion for blending creativity with code and my personal apreciation for 3d on the web.

## 🛠️ Technologies Used

This project leverages the following technologies:

- **Vue 3** with _Composition API_,
- **Typescript**,
- **UnoCss**,
- **Sass** (CSS preprocessor),
- **Three.js**
- **Vite** for tooling and building the project.

## 🐦 Boid Simulation

The simulation follows the principles of boid behavior: **separation**, **alignment**, **cohesion** and a random noise to each boid. To handle the performance of simulating hundreds of boids, I implemented an **octree** for efficient spatial partitioning, enabling smooth flocking behavior even with a large number of agents.

Every frame, boids calculate their positions relative to their neighbors using spatial data from the octree, resulting resulting in fluid, lifelike movements.

## Getting Started

### Prerequisites

Node.js and pnpm: Make sure you have [Node.js](https://nodejs.org/en/download/package-manager/current) installed.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Pedro-Brion/brion-portfolio
```

2. Navigate to the project directory:

```bash
cd brion-portfolio
```

3. Install dependencies:

```bash
pnpm install
```

4. Run

```bash
pnpm dev
```

## 📸 Screenshots

![ScreenShot](/screenshots/image.png "Screenshot 1")
![Screenshot 2](/screenshots/image2.png "Screenshot 2")

## Extra

For a bit of fun, input the _Konami Code_ to unlock **debug mode** and experience the boid simulation separately.
