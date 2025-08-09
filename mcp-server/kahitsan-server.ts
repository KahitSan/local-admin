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

const DOCS_DIR = path.resolve(process.cwd(), "mcp-server");
const COMPONENTS_DIR = path.resolve(process.cwd(), "src/components");
const PAGES_DIR = path.resolve(process.cwd(), "src/pages");

interface KahitSanResource {
  name: string;
  content: string;
  category: 'design-system' | 'component' | 'page' | 'template' | 'domain';
}

function collectKahitSanDocs(): KahitSanResource[] {
  const resources: KahitSanResource[] = [];

  // Create mcp-docs directory if it doesn't exist
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Creating MCP docs directory: ${DOCS_DIR}`);
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    
    // Create a basic design system doc
    const basicDesignSystem = `# KahitSan HUD Design System

## Core Philosophy
- CLI-Inspired terminal aesthetic with Iron Man HUD elements
- Angular geometry with clip-path polygons
- Digital typography using monospace fonts

## CSS Variables
\`\`\`css
--ks-hud-primary: #C9A961;
--ks-hud-green: #00FF00;
--ks-hud-red: #FF0000;
--ks-font-digital: 'Courier New', 'Monaco', monospace;
\`\`\`

## Component Requirements
- ALL interactive elements must use clip-path for angular edges
- ALL headers must use --ks-font-digital and uppercase
- ALL hover effects must include scan line animation
`;
    
    fs.writeFileSync(path.join(DOCS_DIR, 'design-system.mcp.md'), basicDesignSystem);
    console.error('Created basic design-system.mcp.md');
  }

  try {
    // Collect design system docs
    const designSystemFiles = ['design-system.mcp.md', 'coworking-domain.mcp.md', 'component-patterns.mcp.md'];
    designSystemFiles.forEach(file => {
      const filePath = path.join(DOCS_DIR, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        resources.push({
          name: file.replace(".mcp.md", ""),
          content,
          category: 'design-system'
        });
      }
    });

    // Collect component templates
    const templatesDir = path.join(DOCS_DIR, "templates");
    if (fs.existsSync(templatesDir)) {
      fs.readdirSync(templatesDir).forEach(file => {
        if (file.endsWith(".mcp.md")) {
          const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
          resources.push({
            name: `Template: ${file.replace(".mcp.md", "")}`,
            content,
            category: 'template'
          });
        }
      });
    }

    // Collect component docs (if directories exist)
    function scanDirectory(dir: string, category: 'component' | 'page') {
      if (!fs.existsSync(dir)) return;
      
      fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          const docsPath = path.join(itemPath, `${item}.docs.mcp.md`);
          if (fs.existsSync(docsPath)) {
            const content = fs.readFileSync(docsPath, "utf-8");
            resources.push({
              name: `${item} ${category === 'component' ? 'Component' : 'Page'}`,
              content,
              category
            });
          }
        }
      });
    }

    scanDirectory(COMPONENTS_DIR, 'component');
    scanDirectory(PAGES_DIR, 'page');

  } catch (error) {
    console.error('Error collecting docs:', error);
  }

  console.error(`Collected ${resources.length} documentation resources`);
  return resources;
}

class KahitSanMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "kahitsan-admin-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const docs = collectKahitSanDocs();
      return {
        resources: docs.map(doc => ({
          uri: `kahitsan://${doc.category}/${doc.name}`,
          name: doc.name,
          description: `KahitSan ${doc.category} documentation`,
          mimeType: "text/markdown",
        })),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const docs = collectKahitSanDocs();
      const resourceName = request.params.uri.replace(/^kahitsan:\/\/[^\/]+\//, '');
      const doc = docs.find(d => d.name === resourceName);
      
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
                name: {
                  type: "string",
                  description: "Name of the documentation to retrieve",
                },
                category: {
                  type: "string",
                  description: "Optional category filter",
                  enum: ["design-system", "component", "page", "template", "domain"],
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
                componentName: {
                  type: "string",
                  description: "Name of the component to create",
                },
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
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === "get-kahitsan-doc") {
        const docs = collectKahitSanDocs();
        let filtered = docs;
        
        if (args.category) {
          filtered = docs.filter(d => d.category === args.category);
        }
        
        const found = filtered.find(d => 
          d.name.toLowerCase().includes(args.name.toLowerCase())
        );
        
        return {
          content: [
            {
              type: "text",
              text: found?.content || `No KahitSan documentation found for "${args.name}". Available docs: ${docs.map(d => d.name).join(', ')}`,
            },
          ],
        };
      }

      if (name === "create-hud-component") {
        const { componentName, componentType, variant } = args;
        
        const template = `// Generated KahitSan HUD Component: ${componentName}
import React from 'react';
import './${componentName}.css';

interface ${componentName}Props {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  disabled?: boolean;
}

const ${componentName}: React.FC<${componentName}Props> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div 
      className={\`hud-${componentName.toLowerCase()} \${variant !== 'primary' ? \`hud-${componentName.toLowerCase()}-\${variant}\` : ''} \${className}\`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default ${componentName};

/* CSS Template for ${componentName}.css */
/*
.hud-${componentName.toLowerCase()} {
  background: var(--ks-bg-glass);
  border: var(--ks-border-hud);
  border-left: 2px solid var(--ks-hud-primary);
  padding: var(--ks-space-4);
  font-family: var(--ks-font-digital);
  text-transform: uppercase;
  letter-spacing: 2px;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  transition: var(--ks-transition-hud);
}

.hud-${componentName.toLowerCase()}:hover {
  border-left-color: var(--ks-hud-primary-glow);
  background: var(--ks-bg-glass-hover);
}
*/`;
        
        return {
          content: [
            {
              type: "text",
              text: template,
            },
          ],
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