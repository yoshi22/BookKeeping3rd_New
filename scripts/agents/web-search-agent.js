/**
 * Web Search Agent
 *
 * A dedicated agent for performing web searches using the WebSearch tool.
 * This agent is designed to handle only web search operations and provide
 * structured, formatted results.
 */

class WebSearchAgent {
  constructor(options = {}) {
    this.defaultOptions = {
      maxResults: 10,
      allowedDomains: [],
      blockedDomains: [],
      timeout: 30000,
      ...options,
    };
  }

  /**
   * Perform a web search
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async search(query, options = {}) {
    try {
      const searchOptions = { ...this.defaultOptions, ...options };

      if (!query || typeof query !== "string" || query.trim().length === 0) {
        throw new Error("Search query must be a non-empty string");
      }

      // Prepare search parameters
      const searchParams = {
        query: query.trim(),
      };

      // Add domain filtering if specified
      if (
        searchOptions.allowedDomains &&
        searchOptions.allowedDomains.length > 0
      ) {
        searchParams.allowed_domains = searchOptions.allowedDomains;
      }

      if (
        searchOptions.blockedDomains &&
        searchOptions.blockedDomains.length > 0
      ) {
        searchParams.blocked_domains = searchOptions.blockedDomains;
      }

      console.log(`🔍 Web Search Agent: Searching for "${query}"`);

      // Note: In a real implementation, you would call the WebSearch tool here
      // For now, this returns a structured response indicating what would happen
      return {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        searchParams: searchParams,
        message: "Web search agent is ready to perform search",
        note: "This agent would use the WebSearch tool to perform actual searches",
      };
    } catch (error) {
      console.error("❌ Web Search Agent Error:", error.message);
      return {
        success: false,
        error: error.message,
        query: query,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Search for specific topics related to bookkeeping/accounting
   * @param {string} topic - The topic to search for
   * @param {string} context - Additional context (e.g., "簿記3級", "日本語")
   * @returns {Promise<Object>} Search results
   */
  async searchBookkeepingTopic(topic, context = "簿記3級") {
    const query = `${topic} ${context}`;
    return this.search(query, {
      allowedDomains: [
        "kentei.ne.jp",
        "tac-school.co.jp",
        "o-hara.jp",
        "lec-jp.com",
      ],
    });
  }

  /**
   * Search for Japanese resources
   * @param {string} query - The search query
   * @returns {Promise<Object>} Search results
   */
  async searchJapanese(query) {
    return this.search(query, {
      // Add site:jp or Japanese-specific domains if needed
      allowedDomains: [],
    });
  }

  /**
   * Get search suggestions for a query
   * @param {string} partialQuery - Partial search query
   * @returns {Array<string>} Suggested queries
   */
  getSuggestions(partialQuery) {
    const suggestions = [];

    // Common bookkeeping search patterns
    const bookkeepingPatterns = [
      "簿記3級 過去問",
      "簿記3級 仕訳",
      "簿記3級 試験対策",
      "簿記3級 勉強法",
      "商業簿記 基礎",
      "CBT 簿記",
      "日商簿記",
    ];

    // Filter suggestions based on partial query
    if (partialQuery && partialQuery.trim().length > 0) {
      const filtered = bookkeepingPatterns.filter(
        (pattern) =>
          pattern.toLowerCase().includes(partialQuery.toLowerCase()) ||
          partialQuery.toLowerCase().includes(pattern.toLowerCase()),
      );
      suggestions.push(...filtered);
    }

    // If no matches, return general suggestions
    if (suggestions.length === 0) {
      suggestions.push(...bookkeepingPatterns.slice(0, 5));
    }

    return suggestions;
  }

  /**
   * Validate search query
   * @param {string} query - Query to validate
   * @returns {Object} Validation result
   */
  validateQuery(query) {
    const result = {
      valid: true,
      warnings: [],
      suggestions: [],
    };

    if (!query || typeof query !== "string") {
      result.valid = false;
      result.warnings.push("Query must be a string");
      return result;
    }

    const trimmed = query.trim();
    if (trimmed.length === 0) {
      result.valid = false;
      result.warnings.push("Query cannot be empty");
      return result;
    }

    if (trimmed.length < 2) {
      result.warnings.push("Very short queries may not return good results");
      result.suggestions.push("Consider adding more specific terms");
    }

    if (trimmed.length > 100) {
      result.warnings.push("Very long queries may be truncated");
      result.suggestions.push("Consider shortening the query");
    }

    return result;
  }
}

module.exports = WebSearchAgent;

// Export for command line usage
if (require.main === module) {
  const agent = new WebSearchAgent();

  // Get query from command line arguments
  const query = process.argv.slice(2).join(" ");

  if (!query) {
    console.log("Usage: node web-search-agent.js <search query>");
    console.log('Example: node web-search-agent.js "簿記3級 試験対策"');
    process.exit(1);
  }

  agent
    .search(query)
    .then((result) => {
      console.log("\n📊 Search Result:");
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error("❌ Error:", error.message);
      process.exit(1);
    });
}
