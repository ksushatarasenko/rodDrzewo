export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Семейное древо</h1>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6">{children}</main>
      <footer className="text-center py-6 text-sm text-gray-500">© Семья</footer>
    </div>
  )
}
