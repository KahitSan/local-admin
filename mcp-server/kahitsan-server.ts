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

const DOCS_DIR = path.resolve(process.cwd(), "mcp-docs");

const UI_DIRS = {
  base: { dir: path.resolve(process.cwd(), "src/ui/base"), category: "component-base" },
  composite: { dir: path.resolve(process.cwd(), "src/ui/composite"), category: "component-composite" },
  sections: { dir: path.resolve(process.cwd(), "src/ui/sections"), category: "component-section" },
  layouts: { dir: path.resolve(process.cwd(), "src/ui/layouts"), category: "layout" },
  pages: { dir: path.resolve(process.cwd(), "src/ui/pages"), category: "page" },
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

  // Ensure docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Creating MCP docs directory: ${DOCS_DIR}`);
    fs.mkdirSync(DOCS_DIR, { recursive: true });

    const basicDesignSystem = `# KahitSan HUD Design System
...`;
    fs.writeFileSync(path.join(DOCS_DIR, "design-system.mcp.md"), basicDesignSystem);
    console.error("Created basic design-system.mcp.md");
  }

  try {
    // Collect design system docs
    const designSystemFiles = [
      "design-system.mcp.md",
      "coworking-domain.mcp.md",
      "component-architecture.mcp.md",
    ];
    designSystemFiles.forEach((file) => {
      const filePath = path.join(DOCS_DIR, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        resources.push({
          name: file.replace(".mcp.md", ""),
          content,
          category: "design-system",
        });
      }
    });

    // Collect templates
    const templatesDir = path.join(DOCS_DIR, "templates");
    if (fs.existsSync(templatesDir)) {
      fs.readdirSync(templatesDir).forEach((file) => {
        if (file.endsWith(".mcp.md")) {
          const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
          resources.push({
            name: `Template: ${file.replace(".mcp.md", "")}`,
            content,
            category: "template",
          });
        }
      });
    }

    // Scan UI directories for component docs
    Object.entries(UI_DIRS).forEach(([_, { dir, category }]) => {
      if (!fs.existsSync(dir)) return;
      fs.readdirSync(dir).forEach((item) => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          const docsPath = path.join(itemPath, `${item}.docs.mcp.md`);
          if (fs.existsSync(docsPath)) {
            const content = fs.readFileSync(docsPath, "utf-8");
            resources.push({
              name: item,
              content,
              category,
            });
          }
        }
      });
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
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(fullPath);
        if ([".tsx", ".ts", ".jsx", ".js"].includes(ext)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const imports = [...content.matchAll(/import\s+.*?from\s+['"](.*?)['"]/g)].map(m => m[1]);

          files.push({
            path: fullPath,
            name: path.basename(fullPath, ext),
            ext,
            documented: fs.existsSync(fullPath.replace(ext, `.docs.mcp.md`)),
            imports,
          });
        }
      }
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
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const docs = collectKahitSanDocs();
      return {
        resources: docs.map((doc) => ({
          uri: `kahitsan://${doc.category}/${doc.name}`,
          name: doc.name,
          description: `KahitSan ${doc.category} documentation`,
          mimeType: "text/markdown",
        })),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
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
        const { componentName } = args;
        const template = `// Generated KahitSan HUD Component: ${componentName}
...`;
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
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("KahitSan MCP server running on stdio");
  }
}

const server = new KahitSanMCPServer();
server.run().catch(console.error);
