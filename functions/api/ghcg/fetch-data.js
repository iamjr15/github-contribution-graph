import { graphql } from "@octokit/graphql";

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

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
  if (item && Date.now() - item.timestamp < CACHE_TTL) return item.data;
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: corsHeaders });
  }

  const login = new URL(request.url).searchParams.get("login");
  if (!login || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(login)) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing login parameter" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const cached = getCached(login);
  if (cached) {
    return new Response(JSON.stringify(cached), { status: 200, headers: corsHeaders });
  }

  try {
    const graphqlWithAuth = graphql.defaults({
      headers: { authorization: `token ${env.GITHUB_TOKEN}` },
    });
    const data = await graphqlWithAuth(CONTRIBUTION_QUERY, { username: login });
    setCache(login, data);
    return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "User not found" : error.message;
    return new Response(
      JSON.stringify({ error: message, user: null }),
      { status, headers: corsHeaders }
    );
  }
}
