// Mock for 'server-only' package in Jest test environment.
// In production Next.js builds, server-only throws when imported from client components.
// In Jest (Node.js), we stub it as an empty module.
module.exports = {};
