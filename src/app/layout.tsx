// app/layout.tsx
import './globals.css';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';

export const metadata = {
  title: 'My Kanban App',
  description: '…',
  other: {
    'color-scheme': 'light dark',
    'supported-color-schemes': 'light dark',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}