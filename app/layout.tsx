import { AppProvider } from "./context/AppContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <AppProvider>
          {/* HEADER */}
          <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md py-4">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold">ZATCA Sertifika Oluşturma</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="https://www.linkedin.com/in/can-matik/" target="_blank" className="hover:underline">
                  LinkedIn
                </a>
              </nav>
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">{children}</div>
          </main>

          {/* FOOTER */}
          <footer className="bg-gray-900 text-gray-300 text-center py-4">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-sm">
                Made with ❤️ by <a href="https://www.linkedin.com/in/can-matik/" target="_blank" className="text-blue-400 hover:underline">
                  Can Matik
                </a>
              </p>
              <p className="text-xs mt-2">© 2025 ZATCA Sertifika Oluşturma. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
