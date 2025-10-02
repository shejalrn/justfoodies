import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useAuth } from '../utils/AuthContext'
import { useCart } from '../utils/CartContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="JustFoodies" className="h-16 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-text hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-text hover:text-primary transition-colors">
              Menu
            </Link>
            <Link to="/about" className="text-text hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/corporate" className="text-text hover:text-primary transition-colors">
              Corporate
            </Link>
            <Link to="/contact" className="text-text hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/blog" className="text-text hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-text hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-text hover:text-primary transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-text hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-text hover:text-primary transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header