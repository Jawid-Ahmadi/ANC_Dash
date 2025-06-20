export default function Layout({ children }) {
  return (
    <div className="container-fluid" dir="rtl">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-wallet2 me-2"></i>
            سیستم مدیریت مالی مشتریان
          </span>
        </div>
      </nav>
      
      <main className="container">
        {children}
      </main>
      
      <footer className="mt-5 py-3 text-center text-muted">
        <small>© {new Date().getFullYear()} - تمام حقوق محفوظ است</small>
      </footer>
    </div>
  );
}