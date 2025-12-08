const { graphql } = require("@octokit/graphql");

// In-memory cache (resets on cold start)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      avatarUrl
      contributionsCollection {
        contributionCalendar {
          totalContributions
          months {
            name
            totalWeeks
          }
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              weekday
            }
          }
        }
      }
    }
  }
`;

function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const login = event.queryStringParameters?.login;
  if (!login || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(login)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid or missing login parameter" })
    };
  }

  const cached = getCached(login);
  if (cached) {
    return { statusCode: 200, headers, body: JSON.stringify(cached) };
  }

  try {
    const graphqlWithAuth = graphql.defaults({
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
    });

    const data = await graphqlWithAuth(CONTRIBUTION_QUERY, { username: login });
    setCache(login, data);

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "User not found" : error.message;

    return {
      statusCode: status,
      headers,
      body: JSON.stringify({ error: message, user: null })
    };
  }
};
