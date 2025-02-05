import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Deepseek R1 Chat</title>
        <meta name="description" content="Chat with Deepseek R1 AI model" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full bg-gradient-to-br from-blue-50 to-gray-50">
        {children}
      </body>
    </html>
  );
}