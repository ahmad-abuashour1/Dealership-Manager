import serverless from "serverless-http";

/* Netlify's managed Postgres add-on exposes the connection string as NETLIFY_DB_URL */
process.env.DATABASE_URL ??= process.env.NETLIFY_DB_URL;

const { default: app } = await import("@workspace/api-server/src/app");

/* Routed via the /api/* redirect in netlify.toml (classic Lambda-compatible handler) */
export const handler = serverless(app);
