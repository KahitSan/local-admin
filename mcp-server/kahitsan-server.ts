#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

// Fix: Use proper path resolution - check multiple possible locations
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findDocsDir(): string {
  const possiblePaths = [
    process.cwd(), // Current directory (if running from mcp-server)
    path.join(process.cwd(), "mcp-server"), // Subdirectory
    path.join(process.cwd(), "..", "mcp-server"), // Parent directory
    path.join(__dirname, "mcp-server"), // Relative to script
    __dirname, // Script directory itself
  ];

  for (const dir of possiblePaths) {
    // Check if this directory contains the expected files
    const testFile = path.join(dir, "design-system.mcp.md");
    if (fs.existsSync(testFile)) {
      console.error(`Found docs directory at: ${dir}`);
      return dir;
    }
  }

  // Default to mcp-server subdirectory if not found
  console.error(`Docs directory not found, using default: ${path.join(process.cwd(), "mcp-server")}`);
  return path.join(process.cwd(), "mcp-server");
}

const DOCS_DIR = findDocsDir();

// Similarly find project root
function findProjectRoot(): string {
  const possibleRoots = [
    process.cwd(),
    path.resolve(DOCS_DIR, ".."),
    path.resolve(process.cwd(), ".."),
  ];

  for (const root of possibleRoots) {
    if (fs.existsSync(path.join(root, "src"))) {
      console.error(`Found project root at: ${root}`);
      return root;
    }
  }

  console.error(`Project root not found, using: ${process.cwd()}`);
  return process.cwd();
}

const projectRoot = findProjectRoot();
const UI_DIRS = {
  base: { dir: path.join(projectRoot, "src/ui/base"), category: "component-base" },
  composite: { dir: path.join(projectRoot, "src/ui/composite"), category: "component-composite" },
  sections: { dir: path.join(projectRoot, "src/ui/sections"), category: "component-section" },
  layouts: { dir: path.join(projectRoot, "src/layouts"), category: "layout" },
  pages: { dir: path.join(projectRoot, "src/pages"), category: "page" },
};

interface KahitSanResource {
  name: string;
  content: string;
  category:
    | "design-system"
    | "component-base"
    | "component-composite"
    | "component-section"
    | "layout"
    | "page"
    | "template"
    | "domain";
}

/**
 * Creates default project structure documentation
 */
function createDefaultProjectStructure(): string {
  const defaultContent = `# Project Structure

## Overview
This document tracks the project's component organization, documentation status, and potential issues.

## Component Statistics
- Total Files: 0
- Documented: 0
- Undocumented: 0

## Components Audit

### Undocumented Components
*No audit data available yet. Run a manual audit to populate this section.*

### Unused Components
*No audit data available yet. Run a manual audit to populate this section.*

### Duplicate Components
*No audit data available yet. Run a manual audit to populate this section.*

## Directory Structure
\`\`\`
src/
├── ui/
│   ├── base/       # Base UI components
│   ├── composite/  # Composite components
│   └── sections/   # Section components
├── layouts/        # Layout components
└── pages/          # Page components
\`\`\`

## Notes
- This is an auto-generated file. Update with actual project audit results.
- Run component audit tools to identify undocumented, unused, and duplicate components.
`;
  return defaultContent;
}

/**
 * Ensures all required MCP documentation files exist
 */
function ensureMCPFiles() {
  // Ensure docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Creating MCP docs directory: ${DOCS_DIR}`);
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  // Ensure design-system.mcp.md exists
  const designSystemPath = path.join(DOCS_DIR, "design-system.mcp.md");
  if (!fs.existsSync(designSystemPath)) {
    const basicDesignSystem = `# KahitSan HUD Design System

## Core Design Philosophy
- **CLI-Inspired**: Terminal/command-line aesthetic with digital typography
- **Iron Man HUD**: Semi-transparent panels, angular geometry, scanning animations
- **Strong Usability**: High contrast, readable text, mobile-friendly
- **Consistent Hierarchy**: Left border accents, digital fonts, structured layouts

## Color System
\`\`\`css
--ks-hud-primary: #C9A961;        /* Main gold */
--ks-hud-primary-glow: #E5D4A1;   /* Lighter gold */
--ks-hud-secondary: #999999;      /* Gray */
--ks-hud-green: #00FF00;          /* Success */
--ks-hud-red: #FF0000;            /* Error */
--ks-hud-orange: #FF6600;         /* Warning */
--ks-hud-blue: #0080FF;           /* Info */
\`\`\`
`;
    fs.writeFileSync(designSystemPath, basicDesignSystem);
    console.error("Created basic design-system.mcp.md");
  }

  // Ensure project-structure.mcp.md exists
  const projectStructurePath = path.join(DOCS_DIR, "project-structure.mcp.md");
  if (!fs.existsSync(projectStructurePath)) {
    const defaultStructure = createDefaultProjectStructure();
    fs.writeFileSync(projectStructurePath, defaultStructure);
    console.error("Created default project-structure.mcp.md");
  }
}

/**
 * Collects all KahitSan documentation resources from the docs and UI dirs.
 */
function collectKahitSanDocs(): KahitSanResource[] {
  const resources: KahitSanResource[] = [];

  try {
    // Ensure all required files exist
    ensureMCPFiles();

    // Collect design system docs
    const designSystemFiles = [
      "design-system.mcp.md",
      "coworking-domain.mcp.md",
      "component-architecture.mcp.md",
      "project-structure.mcp.md"
    ];
    
    designSystemFiles.forEach((file) => {
      try {
        const filePath = path.join(DOCS_DIR, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          resources.push({
            name: file.replace(".mcp.md", ""),
            content,
            category: "design-system",
          });
        }
      } catch (readError) {
        console.error(`Failed to read file ${file}:`, readError);
      }
    });

    // Collect templates
    const templatesDir = path.join(DOCS_DIR, "templates");
    if (fs.existsSync(templatesDir)) {
      try {
        fs.readdirSync(templatesDir).forEach((file) => {
          if (file.endsWith(".mcp.md")) {
            try {
              const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
              resources.push({
                name: `Template: ${file.replace(".mcp.md", "")}`,
                content,
                category: "template",
              });
            } catch (readError) {
              console.error(`Failed to read template ${file}:`, readError);
            }
          }
        });
      } catch (dirError) {
        console.error("Failed to read templates directory:", dirError);
      }
    }

    // Scan UI directories for component docs
    Object.entries(UI_DIRS).forEach(([, { dir, category }]) => {
      try {
        if (!fs.existsSync(dir)) {
          console.error(`UI directory does not exist: ${dir}`);
          return;
        }
        
        fs.readdirSync(dir).forEach((item) => {
          try {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
              const docsPath = path.join(itemPath, `${item}.docs.mcp.md`);
              if (fs.existsSync(docsPath)) {
                const content = fs.readFileSync(docsPath, "utf-8");
                resources.push({
                  name: item,
                  content,
                  category: category as any,
                });
              }
            }
          } catch (itemError) {
            console.error(`Failed to process item ${item} in ${dir}:`, itemError);
          }
        });
      } catch (dirError) {
        console.error(`Failed to read UI directory ${dir}:`, dirError);
      }
    });
  } catch (error) {
    console.error("Error collecting docs:", error);
  }

  console.error(`Collected ${resources.length} documentation resources`);
  return resources;
}

/**
 * Reads and parses the project-structure.mcp.md file for audit information.
 */
function readProjectStructure() {
  try {
    // Ensure the file exists
    ensureMCPFiles();
    
    const structureFile = path.join(DOCS_DIR, "project-structure.mcp.md");
    const content = fs.readFileSync(structureFile, "utf-8");
    return content;
  } catch (error) {
    // If still fails after ensuring, return a message
    console.error("Failed to read project structure:", error);
    return createDefaultProjectStructure();
  }
}

/**
 * Performs an actual project audit by scanning directories
 */
function performProjectAudit() {
  const audit = {
    totalFiles: 0,
    undocumented: [] as string[],
    unused: [] as string[],
    duplicates: [] as { name: string; paths: string[] }[],
    componentMap: new Map<string, string[]>()
  };

  // Scan all UI directories
  Object.entries(UI_DIRS).forEach(([, { dir, category }]) => {
    if (!fs.existsSync(dir)) return;

    try {
      fs.readdirSync(dir).forEach((item) => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          audit.totalFiles++;
          
          // Check for documentation
          const docsPath = path.join(itemPath, `${item}.docs.mcp.md`);
          if (!fs.existsSync(docsPath)) {
            audit.undocumented.push(`${category}/${item}`);
          }
          
          // Track component names for duplicate detection
          if (audit.componentMap.has(item)) {
            audit.componentMap.get(item)!.push(`${category}/${item}`);
          } else {
            audit.componentMap.set(item, [`${category}/${item}`]);
          }
        }
      });
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error);
    }
  });

  // Find duplicates
  audit.componentMap.forEach((paths, name) => {
    if (paths.length > 1) {
      audit.duplicates.push({ name, paths });
    }
  });

  return audit;
}

/**
 * Parses project structure markdown content to extract audit information.
 */
function parseProjectStructure(content: string) {
  // First, try to parse existing content
  const lines = content.split('\n');
  const result = {
    totalFiles: 0,
    undocumented: [] as string[],
    unused: [] as string[],
    duplicates: [] as { name: string; paths: string[] }[],
    structure: content
  };

  let inSection = '';
  let hasData = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('Total Files:') || trimmed.includes('total files')) {
      const match = trimmed.match(/(\d+)/);
      if (match) {
        result.totalFiles = parseInt(match[1]);
        hasData = true;
      }
    }
    
    if (trimmed.toLowerCase().includes('undocumented')) {
      inSection = 'undocumented';
      continue;
    }
    
    if (trimmed.toLowerCase().includes('unused')) {
      inSection = 'unused';
      continue;
    }
    
    if (trimmed.toLowerCase().includes('duplicate')) {
      inSection = 'duplicates';
      continue;
    }
    
    // Reset section on new heading
    if (trimmed.startsWith('#')) {
      inSection = '';
    }
    
    // Parse list items
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const item = trimmed.substring(1).trim();
      
      if (item && item !== 'No audit data available yet. Run a manual audit to populate this section.') {
        if (inSection === 'undocumented') {
          result.undocumented.push(item);
          hasData = true;
        } else if (inSection === 'unused') {
          result.unused.push(item);
          hasData = true;
        } else if (inSection === 'duplicates') {
          // Parse duplicate format like "ComponentName: path1, path2"
          const colonIndex = item.indexOf(':');
          if (colonIndex > -1) {
            const name = item.substring(0, colonIndex).trim();
            const paths = item.substring(colonIndex + 1).split(',').map(p => p.trim());
            result.duplicates.push({ name, paths });
            hasData = true;
          }
        }
      }
    }
  }

  // If no data found in the file, perform actual audit
  if (!hasData || result.totalFiles === 0) {
    console.error("No audit data found in project-structure.mcp.md, performing live audit...");
    const liveAudit = performProjectAudit();
    return {
      ...liveAudit,
      structure: content
    };
  }

  return result;
}

class KahitSanMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      { name: "kahitsan-admin-mcp", version: "2.3.0" },
      { capabilities: { resources: {}, tools: {} } }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit, try to continue
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit, try to continue
    });

    // Handle SIGPIPE (broken pipe) errors gracefully
    process.on('SIGPIPE', () => {
      console.error('SIGPIPE received, client disconnected');
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      try {
        const docs = collectKahitSanDocs();
        return {
          resources: docs.map((doc) => ({
            uri: `kahitsan://${doc.category}/${doc.name}`,
            name: doc.name,
            description: `KahitSan ${doc.category} documentation`,
            mimeType: "text/markdown",
          })),
        };
      } catch (error) {
        console.error("Error in ListResources:", error);
        throw new McpError(ErrorCode.InternalError, "Failed to list resources");
      }
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      try {
        const docs = collectKahitSanDocs();
        const resourceName = request.params.uri.replace(/^kahitsan:\/\/[^/]+\//, "");
        const doc = docs.find((d) => d.name === resourceName);

        if (!doc) {
          throw new McpError(ErrorCode.MethodNotFound, `Resource not found: ${resourceName}`);
        }

        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: "text/markdown",
              text: doc.content,
            },
          ],
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        console.error("Error in ReadResource:", error);
        throw new McpError(ErrorCode.InternalError, "Failed to read resource");
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get-kahitsan-doc",
            description: "Get KahitSan documentation for components, design system, or domain knowledge.",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of the documentation to retrieve" },
                category: {
                  type: "string",
                  description: "Optional category filter",
                  enum: [
                    "design-system",
                    "component-base",
                    "component-composite",
                    "component-section",
                    "layout",
                    "page",
                    "template",
                    "domain",
                  ],
                },
              },
              required: ["name"],
            },
          },
          {
            name: "create-hud-component",
            description: "Generate a new KahitSan HUD component with proper styling.",
            inputSchema: {
              type: "object",
              properties: {
                componentName: { type: "string", description: "Name of the component to create" },
                componentType: {
                  type: "string",
                  description: "Type of component",
                  enum: ["ui", "layout", "dashboard"],
                },
                variant: {
                  type: "string",
                  description: "Component variant",
                  enum: ["button", "input", "card", "modal", "table"],
                },
              },
              required: ["componentName", "componentType"],
            },
          },
          {
            name: "project-audit",
            description: "Audit the project for unused, undocumented, and duplicate components. Reads from project-structure.mcp.md or performs live audit.",
            inputSchema: {
              type: "object",
              properties: {
                root: { type: "string", description: "Ignored - reads from project-structure.mcp.md", default: "src" }
              }
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        if (name === "get-kahitsan-doc") {
          const docs = collectKahitSanDocs();
          let filtered = docs;

          if (args.category) {
            filtered = docs.filter((d) => d.category === args.category);
          }

          const found = filtered.find((d) =>
            d.name.toLowerCase().includes(args.name.toLowerCase())
          );

          return {
            content: [
              {
                type: "text",
                text:
                  found?.content ||
                  `No KahitSan documentation found for "${args.name}". Available docs: ${docs
                    .map((d) => d.name)
                    .join(", ")}`,
              },
            ],
          };
        }

        if (name === "create-hud-component") {
          const { componentName, componentType, variant } = args;
          const template = `// Generated KahitSan HUD Component: ${componentName}
import React from 'react';
import { cn } from '@/utils/cn';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn(
      "hud-${variant || 'component'}",
      "bg-ks-bg-glass border border-ks-border-hud",
      "border-l-2 border-l-ks-hud-primary",
      "backdrop-blur-sm transition-all duration-300",
      "hover:bg-ks-bg-glass-hover hover:border-l-ks-hud-primary-glow",
      className
    )}>
      {children}
    </div>
  );
};

export default ${componentName};
`;
          return { content: [{ type: "text", text: template }] };
        }

        if (name === "project-audit") {
          const structureContent = readProjectStructure();
          const result = parseProjectStructure(structureContent);

          const auditReport = `📊 Project Audit Results

## Summary
- Total Files: ${result.totalFiles}
- Undocumented: ${result.undocumented.length}
- Unused: ${result.unused.length}
- Duplicates: ${result.duplicates.length}

## Undocumented Files
${result.undocumented.length > 0 ? result.undocumented.map(f => `• ${f}`).join("\n") : "✅ None found"}

## Unused Files
${result.unused.length > 0 ? result.unused.map(f => `• ${f}`).join("\n") : "✅ None found"}

## Duplicate Components
${result.duplicates.length > 0 ? result.duplicates.map(d => `• ${d.name}: ${d.paths.join(", ")}`).join("\n") : "✅ None found"}

---
*Audit data sourced from: mcp-server/project-structure.mcp.md*
*If this is a default file, update it with actual audit results or the tool will perform a live scan.*
`;

          return {
            content: [
              {
                type: "text",
                text: auditReport
              }
            ]
          };
        }

        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        console.error(`Error in tool ${request.params.name}:`, error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });
  }

  async run() {
    try {
      // Ensure MCP files exist on startup
      ensureMCPFiles();
      
      const transport = new StdioServerTransport();
      
      // Add error handling for transport
      transport.onError = (error) => {
        console.error("Transport error:", error);
        // Don't exit, let the server handle it
      };
      
      await this.server.connect(transport);
      console.error("KahitSan MCP server v2.3.0 running on stdio");
      console.error(`Docs directory: ${DOCS_DIR}`);
      console.error(`Project root: ${projectRoot}`);
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
}

const server = new KahitSanMCPServer();
server.run().catch((error) => {
  console.error("Server runtime error:", error);
  process.exit(1);
});