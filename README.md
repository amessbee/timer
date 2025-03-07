# Exam Timer App

This project is an exam timer application built with JavaScript, HTML, and CSS. It was bootstrapped with [React App](https://github.com/facebook/create-react-app).

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

For a demonstration view the output at: https://amessbee.github.io/timer/ - to get a local copy up and running follow these simple steps.

## Usage

The Exam Timer app offers several interactive features to customize your experience:

### Timer Controls

- **Preset Durations**: Click on any of the preset duration buttons (15, 30, 60, 90, 100, 120, 150, or 180 minutes) to quickly set the timer.
- **Custom Timer**: Double-click on the timer display to manually enter a custom time in HH:MM:SS format.
- **Start/Pause/Stop/Reset**: Use the control buttons at the bottom to manage the timer.
- **Add Time**: Click the "+" icon in the top-right corner to add 5 minutes to the current timer.

### Customization

- **Edit Title**: Double-click on the "Exam Timer" text to change it to any title you prefer.
- **Theme Toggle**: Click the sun/moon icon in the top-right corner to switch between light and dark themes.
- **Animation Controls**: Click the play/pause icon to access animation settings:
  - Adjust the animation intensity using the slider
  - Enable or disable animations completely
  - Reset to default animation settings

### Display Options

- **Full Screen**: Click the expand icon to enter or exit full-screen mode.
- **Hide/Show**: Click the eye icon to hide or show the timer (useful for presentations).

### Persistence

The timer state is automatically saved, so if you accidentally close the browser or refresh the page, your timer will continue to run in the background.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and npm installed on your machine.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/amessbee/timer.git
   ```
2. Install NPM packages
```sh
npm install
```
3. Run the app in the development mode. Open http://localhost:3000 to view it in your browser. For a demonstration view the output at: https://amessbee.github.io/timer/

```sh
npm start
```

### Other Scripts

#### `npm test`

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

#### `npm run build`

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the
build for the best performance.

#### `npm run eject`

Note: this is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

### Technologies Used

- JavaScript (81.9%)
- HTML (11%)
- CSS (7.1%)

### Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

- Fork the Project
- Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
- Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
- Push to the Branch (`git push origin feature/AmazingFeature`)
- Open a Pull Request

### License

Distributed under the MIT License.
