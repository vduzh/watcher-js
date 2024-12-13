# watcher-js

watcher-js is a simple Node.js application that monitors changes in a source directory and synchronizes them to a target directory. It supports creating default directories if none are specified in the configuration file.

## Features
- Watches for file additions, modifications, and deletions.
- Automatically synchronizes changes to the target directory.
- Creates default `src` and `target` directories if no configuration file is present.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js installation

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd watcher-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Configuration

You can use a configuration file to specify custom paths for the source and target directories.

### Option 1: Using `config.json`

1. Create a file named `config.json` in the root of the project.
2. Specify the paths for `sourceDir` and `targetDir`. Example:
   ```json
   {
     "sourceDir": "D:/path/to/source",
     "targetDir": "D:/path/to/target"
   }
   ```

### Option 2: Default Configuration

If no `config.json` is provided:
- The application will create and use default directories:
  - `src` (source directory)
  - `target` (target directory)

---

## Running the Application

1. Start the watcher:
   ```bash
   node index.js
   ```

2. Logs will display the status:
   - Watching for changes in the source directory
   - File additions, modifications, or deletions

3. Modify files in the source directory to see them synchronized in the target directory.

---

## Example Output

```bash
Source directory ensured: /path/to/src
Target directory ensured: /path/to/target
Watching for changes in folder: /path/to/src
File added: /path/to/src/example.txt
File copied successfully: /path/to/src/example.txt -> /path/to/target/example.txt
```

---

## License
This project is licensed under the MIT License.
