/**
 * @file apps/web/app/layout.tsx
 * @summary Root layout component for the web application.
 * @description Provides the HTML structure and metadata for the web app.
 * @security None - Layout component only
 * @requirements none
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
