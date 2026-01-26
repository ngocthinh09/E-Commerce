import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import WhiteLogo from '../assets/images/logo-white.png';
import MobileWhiteLogo from '../assets/images/mobile-logo-white.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import CartIcon from '../assets/images/icons/cart-icon.png';
import './Header.css';

function Header({ cart }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');

  const [search, setSearch] = useState(searchText || '');

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  const updateSearchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchProducts = () => {
    console.log(`Searching: ${search}`);
    navigate(`/?search=${search}`)
  };

  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <img className="logo" src={WhiteLogo} />
          <img className="mobile-logo" src={MobileWhiteLogo} />
        </NavLink>
      </div>

      <div className="middle-section">
        <input 
          className="search-bar" type="text" 
          placeholder="Search" 
          onChange={updateSearchInput}
        />

        <button 
          className="search-button"
          onClick={searchProducts}
        >
          <img className="search-icon" src={SearchIcon} />
        </button>
      </div>

      <div className="right-section">
        <NavLink className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src={CartIcon} />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
