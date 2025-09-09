
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AddPage } from '@/pages/AddPage';
import { ListPage } from '@/pages/ListPage';
import { Button } from '@/components/ui/button';
import { Home, Plus, List } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="fixed top-4 right-4 z-50 flex gap-2">
          <Link to="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/add">
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/list">
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;