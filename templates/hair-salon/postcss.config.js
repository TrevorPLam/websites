// File: templates/hair-salon/postcss.config.js  [TRACE:FILE=templates.hairSalon.postcss]
// Purpose: PostCSS configuration for Tailwind CSS v4. Uses @tailwindcss/postcss only;
//          v4 handles vendor prefixing internally, so autoprefixer is removed.
// Task: 0.4 Tailwind v4 migration
// Features: [FEAT:TOOLING] [FEAT:CONFIGURATION]

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
