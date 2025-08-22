#!/usr/bin/env node
/**
 * Agent Runner
 *
 * A general-purpose agent runner that can execute different types of agents
 * including the web search agent.
 */

const fs = require("fs");
const path = require("path");
const WebSearchAgent = require("./web-search-agent");

class AgentRunner {
  constructor() {
    this.agents = new Map();
    this.configPath = path.join(__dirname, "agent-config.json");

    // Register available agents
    this.registerAgent("web-search", WebSearchAgent);

    // Load configuration
    this.loadConfig();
  }

  /**
   * Register an agent type
   * @param {string} type - Agent type identifier
   * @param {Class} AgentClass - Agent class constructor
   */
  registerAgent(type, AgentClass) {
    this.agents.set(type, AgentClass);
  }

  /**
   * Load agent configuration from file
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, "utf8");
        this.config = JSON.parse(configData);
      } else {
        // Default configuration
        this.config = {
          agents: {
            "web-search": {
              maxResults: 10,
              timeout: 30000,
              allowedDomains: [],
              blockedDomains: [],
            },
          },
          defaultAgent: "web-search",
          verbose: false,
        };
        this.saveConfig();
      }
    } catch (error) {
      console.error("❌ Error loading configuration:", error.message);
      this.config = { agents: {}, defaultAgent: "web-search", verbose: false };
    }
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error("❌ Error saving configuration:", error.message);
    }
  }

  /**
   * Run an agent
   * @param {string} type - Agent type
   * @param {string} command - Command to execute
   * @param {Object} options - Command options
   * @returns {Promise<Object>} Agent result
   */
  async runAgent(type, command, options = {}) {
    try {
      if (!this.agents.has(type)) {
        throw new Error(
          `Unknown agent type: ${type}. Available types: ${Array.from(this.agents.keys()).join(", ")}`,
        );
      }

      const AgentClass = this.agents.get(type);
      const agentConfig = this.config.agents[type] || {};
      const agent = new AgentClass(agentConfig);

      if (this.config.verbose) {
        console.log(`🤖 Running ${type} agent with command: ${command}`);
      }

      // Execute the appropriate command
      switch (command) {
        case "search":
          if (!options.query) {
            throw new Error("Search command requires a query");
          }
          return await agent.search(options.query, options);

        case "search-bookkeeping":
          if (!options.topic) {
            throw new Error("Search-bookkeeping command requires a topic");
          }
          return await agent.searchBookkeepingTopic(
            options.topic,
            options.context,
          );

        case "search-japanese":
          if (!options.query) {
            throw new Error("Search-japanese command requires a query");
          }
          return await agent.searchJapanese(options.query);

        case "suggestions":
          return {
            success: true,
            suggestions: agent.getSuggestions(options.partial || ""),
            timestamp: new Date().toISOString(),
          };

        case "validate":
          if (!options.query) {
            throw new Error("Validate command requires a query");
          }
          return {
            success: true,
            validation: agent.validateQuery(options.query),
            timestamp: new Date().toISOString(),
          };

        default:
          throw new Error(
            `Unknown command: ${command}. Available commands: search, search-bookkeeping, search-japanese, suggestions, validate`,
          );
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * List available agents
   * @returns {Array<string>} List of available agent types
   */
  listAgents() {
    return Array.from(this.agents.keys());
  }

  /**
   * Get agent information
   * @param {string} type - Agent type
   * @returns {Object} Agent information
   */
  getAgentInfo(type) {
    if (!this.agents.has(type)) {
      return null;
    }

    const config = this.config.agents[type] || {};
    return {
      type: type,
      available: true,
      config: config,
      commands: this.getAvailableCommands(type),
    };
  }

  /**
   * Get available commands for an agent type
   * @param {string} type - Agent type
   * @returns {Array<string>} Available commands
   */
  getAvailableCommands(type) {
    switch (type) {
      case "web-search":
        return [
          "search",
          "search-bookkeeping",
          "search-japanese",
          "suggestions",
          "validate",
        ];
      default:
        return ["search"];
    }
  }
}

// Command line interface
if (require.main === module) {
  const runner = new AgentRunner();

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("📖 Agent Runner Usage:");
    console.log("");
    console.log("Basic usage:");
    console.log(
      "  node run-agent.js --type=<agent-type> --command=<command> [options]",
    );
    console.log("");
    console.log("Examples:");
    console.log(
      '  node run-agent.js --type=web-search --command=search --query="簿記3級 試験対策"',
    );
    console.log(
      '  node run-agent.js --type=web-search --command=search-bookkeeping --topic="仕訳"',
    );
    console.log(
      '  node run-agent.js --type=web-search --command=suggestions --partial="簿記"',
    );
    console.log("  node run-agent.js --list-agents");
    console.log("  node run-agent.js --info=web-search");
    console.log("");
    console.log("Available agents:", runner.listAgents().join(", "));
    process.exit(0);
  }

  // Parse arguments
  const options = {};
  let agentType = null;
  let command = null;

  for (const arg of args) {
    if (arg === "--list-agents") {
      console.log("Available agents:");
      runner.listAgents().forEach((type) => {
        console.log(`  - ${type}`);
      });
      process.exit(0);
    } else if (arg.startsWith("--info=")) {
      const type = arg.split("=")[1];
      const info = runner.getAgentInfo(type);
      if (info) {
        console.log(`Agent Info: ${type}`);
        console.log(JSON.stringify(info, null, 2));
      } else {
        console.error(`❌ Unknown agent type: ${type}`);
        process.exit(1);
      }
      process.exit(0);
    } else if (arg.startsWith("--type=")) {
      agentType = arg.split("=")[1];
    } else if (arg.startsWith("--command=")) {
      command = arg.split("=")[1];
    } else if (arg.startsWith("--")) {
      const [key, value] = arg.substring(2).split("=");
      options[key] = value || true;
    }
  }

  // Validate required arguments
  if (!agentType) {
    console.error("❌ Error: --type is required");
    process.exit(1);
  }

  if (!command) {
    console.error("❌ Error: --command is required");
    process.exit(1);
  }

  // Set verbose mode if requested
  if (options.verbose) {
    runner.config.verbose = true;
  }

  // Run the agent
  runner
    .runAgent(agentType, command, options)
    .then((result) => {
      console.log("\n📊 Agent Result:");
      console.log(JSON.stringify(result, null, 2));

      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Error:", error.message);
      process.exit(1);
    });
}

module.exports = AgentRunner;
