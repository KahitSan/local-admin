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

// Fix: Use proper path resolution
const DOCS_DIR = path.join(process.cwd(), "mcp-server");

const UI_DIRS = {
  base: { dir: path.join(process.cwd(), "src/ui/base"), category: "component-base" },
  composite: { dir: path.join(process.cwd(), "src/ui/composite"), category: "component-composite" },
  sections: { dir: path.join(process.cwd(), "src/ui/sections"), category: "component-section" },
  layouts: { dir: path.join(process.cwd(), "src/layouts"), category: "layout" },
  pages: { dir: path.join(process.cwd(), "src/pages"), category: "page" },
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
 * Collects all KahitSan documentation resources from the docs and UI dirs.
 */
function collectKahitSanDocs(): KahitSanResource[] {
  const resources: KahitSanResource[] = [];

  // Fix: Better error handling and path resolution
  try {
    // Ensure docs directory exists
    if (!fs.existsSync(DOCS_DIR)) {
      console.error(`Creating MCP docs directory: ${DOCS_DIR}`);
      try {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
        
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
        fs.writeFileSync(path.join(DOCS_DIR, "design-system.mcp.md"), basicDesignSystem);
        console.error("Created basic design-system.mcp.md");
      } catch (mkdirError) {
        console.error("Failed to create docs directory:", mkdirError);
        return resources; // Return empty array if we can't create the directory
      }
    }

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
    Object.entries(UI_DIRS).forEach(([dirName, { dir, category }]) => {
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
 * Recursively scans project files and returns info for analysis.
 */
function scanProjectFiles(rootDir: string) {
  const files: { path: string; name: string; ext: string; documented: boolean; imports: string[] }[] = [];

  function walk(dir: string) {
    try {
      for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walk(fullPath);
          } else {
            const ext = path.extname(fullPath);
            if ([".tsx", ".ts", ".jsx", ".js"].includes(ext)) {
              try {
                const content = fs.readFileSync(fullPath, "utf-8");
                const imports = [...content.matchAll(/import\s+.*?from\s+['"](.*?)['"]/g)].map(m => m[1]);

                files.push({
                  path: fullPath,
                  name: path.basename(fullPath, ext),
                  ext,
                  documented: fs.existsSync(fullPath.replace(ext, `.docs.mcp.md`)),
                  imports,
                });
              } catch (readError) {
                console.error(`Failed to read file ${fullPath}:`, readError);
              }
            }
          }
        } catch (statError) {
          console.error(`Failed to stat ${fullPath}:`, statError);
        }
      }
    } catch (readDirError) {
      console.error(`Failed to read directory ${dir}:`, readDirError);
    }
  }

  walk(rootDir);
  return files;
}

/**
 * Runs analysis to detect unused, undocumented, and duplicate components.
 */
function analyzeProject(rootDir: string) {
  const files = scanProjectFiles(rootDir);

  const allImports = new Set(files.flatMap(f => f.imports.map(i => path.basename(i))));
  const unused = files.filter(f => !allImports.has(f.name));
  const undocumented = files.filter(f => !f.documented);

  const nameGroups = files.reduce((acc, f) => {
    acc[f.name] = acc[f.name] || [];
    acc[f.name].push(f.path);
    return acc;
  }, {} as Record<string, string[]>);

  const duplicates = Object.entries(nameGroups)
    .filter(([_, paths]) => paths.length > 1)
    .map(([name, paths]) => ({ name, paths }));

  return { unused, undocumented, duplicates, totalFiles: files.length };
}

class KahitSanMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      { name: "kahitsan-admin-mcp", version: "2.1.0" },
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
        const resourceName = request.params.uri.replace(/^kahitsan:\/\/[^\/]+\//, "");
        const doc = docs.find((d) => d.name === resourceName);

        if (!doc) {
          throw new McpError(ErrorCode.NotFound, `Resource not found: ${resourceName}`);
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
            description: "Audit the project for unused, undocumented, and duplicate components.",
            inputSchema: {
              type: "object",
              properties: {
                root: { type: "string", description: "Project root directory", default: "src" }
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
          const rootDir = path.resolve(process.cwd(), args.root || "src");
          if (!fs.existsSync(rootDir)) {
            throw new McpError(ErrorCode.InvalidParams, `Directory not found: ${rootDir}`);
          }

          const result = analyzeProject(rootDir);
          return {
            content: [
              {
                type: "text",
                text: `📊 Project Audit Results:
- Total Files: ${result.totalFiles}
- Undocumented: ${result.undocumented.length}
- Unused: ${result.unused.length}
- Duplicates: ${result.duplicates.length}

Undocumented Files:
${result.undocumented.map(f => `• ${f.path}`).join("\n") || "✅ None"}

Unused Files:
${result.unused.map(f => `• ${f.path}`).join("\n") || "✅ None"}

Duplicate Components:
${result.duplicates.map(d => `• ${d.name}: ${d.paths.join(", ")}`).join("\n") || "✅ None"}
`
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
      const transport = new StdioServerTransport();
      
      // Add error handling for transport
      transport.onError = (error) => {
        console.error("Transport error:", error);
        // Don't exit, let the server handle it
      };
      
      await this.server.connect(transport);
      console.error("KahitSan MCP server running on stdio");
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