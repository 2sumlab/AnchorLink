# AnchorLink

Open local files and folders via URL link. Runs a local HTTP service that bridges web links to your local filesystem — useful for embedding local file shortcuts in tools like Notion.

## Features

- Open local files by URL
- Open or create files if they don't exist
- Open or create folders if they don't exist

## How to Use

Use the following endpoints with `http://localhost:3000`:

| Endpoint | Description |
|---|---|
| `/open-file?path=<path>` | Open an existing local file |
| `/open-or-create?path=<path>` | Open a file, or create it if it doesn't exist |
| `/open-or-create?path=<path>&type=folder` | Open a folder, or create it if it doesn't exist |

**Example:**
```
http://localhost:3000/open-file?path=/Users/dan/Notes/todo.md
http://localhost:3000/open-or-create?path=/Users/dan/Notes/todo.md
http://localhost:3000/open-or-create?path=/Users/dan/Notes/Projects&type=folder
```

## Getting Started

You'll need [Node.js](https://nodejs.org/) installed on your computer.

```shell
$ npm install
$ npm start
```

## Dependencies

- Electron
- Express
- Node.js

## License

MIT License — [2sumlab](https://github.com/2sumlab)
