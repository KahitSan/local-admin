
# MCP Server Integration

## Introduction
This document explains how to integrate the **kahitsan-admin MCP server** into Claude Desktop.  
You will update your `claude_desktop_config.json` file to add the MCP server configuration, ensuring Claude can communicate with your local project.

## Prerequisites
Before you begin, ensure the following:

1. **Claude Desktop** is installed and working.
2. **Node.js v20.19.0** (recommended).  
   To check your version:
    ```bash
    node -v
    ```

If you do not have v20.19.0, it is recommended to install it via [nvm](https://github.com/nvm-sh/nvm) or the [official Node.js site](https://nodejs.org/).

---

## Step 1 — Locate Your Configuration File

The `claude_desktop_config.json` file is located in different places depending on your operating system.

| Operating System | Path                                                              |
| ---------------- | ----------------------------------------------------------------- |
| **macOS**        | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux**        | `~/.config/Claude/claude_desktop_config.json`                     |
| **Windows**      | `%APPDATA%\Claude\claude_desktop_config.json`                     |

**Tip:** You can open the containing folder by pasting the path into your file explorer or using your terminal.

---

## Step 2 — Make a Backup

Before editing, make a backup in case you need to revert.

**macOS / Linux**

```bash
cp "/path/to/claude_desktop_config.json" "/path/to/claude_desktop_config.json.bak"
```

**Windows (PowerShell)**

```powershell
Copy-Item "$env:APPDATA\Claude\claude_desktop_config.json" "$env:APPDATA\Claude\claude_desktop_config.json.bak"
```

---

## Step 3 — Find Your Absolute Paths

You will need two absolute paths:

1. The path to your **`npx`** command.
2. The path to your **`kahitsan-server.ts`** file.

### macOS / Linux

**Find `npx` path:**

```bash
which npx
```

Example output:

```
/Users/your-username/.nvm/versions/node/v20.19.0/bin/npx
```

**Find `kahitsan-server.ts` path:**

* Navigate to your project folder in Finder (macOS) or File Manager (Linux).
* Right-click `kahitsan-server.ts` → **Copy as Pathname** (macOS) or **Properties** → copy the full path (Linux).
* Or from terminal:

```bash
realpath path/to/kahitsan-server.ts
```

---

### Windows

**Find `npx` path:**

```powershell
where npx
```

Example output:

```
C:\Users\your-username\AppData\Roaming\nvm\v20.19.0\npx.cmd
```

**Find `kahitsan-server.ts` path:**

* In File Explorer, navigate to the file.
* Hold **Shift**, right-click the file, and select **Copy as Path**.
* This will copy something like:

```
C:\Users\your-username\Documents\Projects\local-admin\mcp-server\kahitsan-server.ts
```

---

## Step 4 — Edit the Configuration File

1. Open `claude_desktop_config.json` in your preferred text editor (VS Code, Sublime Text, Notepad, etc.).
2. Add or update the `mcpServers` section with the following block:

```json
{
  "mcpServers": {
    "kahitsan-admin": {
      "command": "/absolute/path/to/npx",
      "args": ["tsx", "/absolute/path/to/kahitsan-server.ts"],
      "env": {
        "PATH": "/absolute/path/to/node/bin:/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

**Replace the following:**

* `/absolute/path/to/npx` → Path from **Find `npx` path** step.
* `/absolute/path/to/kahitsan-server.ts` → Path from **Find `kahitsan-server.ts` path** step.
* `PATH` value → Include your Node.js bin path first, followed by system defaults.

---

## Step 5 — Save the File

After making changes, save the file and close the editor.

---

## Step 6 — Restart Claude Desktop

Restart Claude Desktop so it loads the new MCP configuration.

---

## Verification

1. Open Claude Desktop.
2. Check the MCP server list.
3. Confirm **kahitsan-admin** is present and active.

---

## Troubleshooting

If something breaks, restore your backup.

**macOS / Linux**

```bash
mv "/path/to/claude_desktop_config.json.bak" "/path/to/claude_desktop_config.json"
```

**Windows (PowerShell)**

```powershell
Move-Item "$env:APPDATA\Claude\claude_desktop_config.json.bak" "$env:APPDATA\Claude\claude_desktop_config.json" -Force
```
