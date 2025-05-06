# Workflow Automator

A cross-platform desktop application for creating, managing, and executing custom workflows for data processing and transformation. Built with Electron, React, and Python.

## Features

- Create, edit, and delete workflows
- Drag-and-drop interface for workflow creation
- Pre-built actions for common tasks:
  - Load data from files or custom scripts
  - Save data to files
  - More actions coming soon...
- Real-time execution status and logs
- Dark/Light theme support
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/workflow-automator.git
cd workflow-automator
```

2. Install dependencies:

```bash
# Install main dependencies
npm install

# Install renderer (React) dependencies
cd renderer
npm install
cd ..
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will:

1. Start the React development server
2. Wait for the server to be ready
3. Launch the Electron application

## Building

To build the application for production:

```bash
# Build the React application
cd renderer
npm run build
cd ..

# Build the Electron application
npm run build
```

## Project Structure

```
workflow-automator/
├── main.js                 # Electron main process
├── preload.js             # Electron preload script
├── package.json           # Main package.json
├── renderer/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/        # Redux store and slices
│   │   ├── actions/      # Python scripts for workflow actions
│   │   └── App.js        # Main React component
│   ├── public/           # Static assets
│   └── package.json      # React package.json
└── actions/              # Python scripts for workflow actions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [ReactFlow](https://reactflow.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
