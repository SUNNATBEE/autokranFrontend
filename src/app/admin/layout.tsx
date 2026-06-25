import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';
import { AdminIntlProvider } from '@/components/admin/AdminIntlProvider';
import { AdminShell } from '@/components/admin/AdminShell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <AdminIntlProvider>
          <AdminShell>{children}</AdminShell>
        </AdminIntlProvider>
      </body>
    </html>
  );
}
