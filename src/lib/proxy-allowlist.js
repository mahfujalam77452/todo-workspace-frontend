// Only these backend paths can be reached from the browser through /api/*.
// Auth endpoints are not listed on purpose: they have their own route handlers.
// The backend still enforces every permission. This list only reduces what is exposed.
const RULES = [
  { pattern: /^\/pm\/bulk-emails$/, methods: ['GET', 'POST'] },
  { pattern: /^\/categories$/, methods: ['GET', 'POST'] },
  { pattern: /^\/categories\/\d+$/, methods: ['PATCH', 'DELETE'] },
  { pattern: /^\/admin\/teams$/, methods: ['POST'] },
  { pattern: /^\/admin\/teams\/\d+$/, methods: ['PATCH', 'DELETE'] },
  { pattern: /^\/todos$/, methods: ['GET', 'POST'] },
  { pattern: /^\/todos\/\d+$/, methods: ['GET', 'PATCH', 'DELETE'] },
  { pattern: /^\/todos\/\d+\/(assign|accept|reject)$/, methods: ['POST'] },

  { pattern: /^\/categories$/, methods: ['GET'] },
  { pattern: /^\/teams$/, methods: ['GET'] },
  { pattern: /^\/teams\/\d+\/members$/, methods: ['GET'] },

  { pattern: /^\/notifications$/, methods: ['GET'] },
  { pattern: /^\/notifications\/unread-count$/, methods: ['GET'] },
  { pattern: /^\/notifications\/read-all$/, methods: ['POST'] },
  { pattern: /^\/notifications\/\d+\/read$/, methods: ['POST'] },

  { pattern: /^\/admin\/users$/, methods: ['GET'] },
  { pattern: /^\/admin\/users\/\d+$/, methods: ['GET', 'PATCH'] },
  { pattern: /^\/admin\/users\/\d+\/todos$/, methods: ['GET'] },
  { pattern: /^\/admin\/todos\/\d+$/, methods: ['GET'] },
  { pattern: /^\/admin\/dashboard\/(overview|users|teams|activity)$/, methods: ['GET'] },
  { pattern: /^\/admin\/scrums$/, methods: ['GET', 'POST'] },
  { pattern: /^\/admin\/scrums\/\d+\/start$/, methods: ['POST'] },
  { pattern: /^\/admin\/scrums\/\d+\/end$/, methods: ['POST'] },
  { pattern: /^\/admin\/dashboard\/settings$/, methods: ['GET', 'PATCH'] },
  { pattern: /^\/admin\/dashboard\/heatmap$/, methods: ['GET'] },
  { pattern: /^\/admin\/dashboard\/teams\/\d+\/analytics$/, methods: ['GET'] },
];

export function isAllowed(path, method) {
  return RULES.some((rule) => rule.pattern.test(path) && rule.methods.includes(method));
}