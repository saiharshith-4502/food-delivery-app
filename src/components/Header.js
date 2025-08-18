import { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../utils/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faBurger } from '@fortawesome/free-solid-svg-icons'; // or faHamburger in older versions
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import logo from './logo.png';

const Header = () => {
    const [btnValue,setBtnValue] = useState('Login');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showCartTooltip, setShowCartTooltip] = useState(false);

    const {loggedInUser} = useContext(UserContext);

    //subscribing to the store using selector
    const cartItems = useSelector((store) => store.cart.items);
    const scheduledOrders = useSelector((store) => store.scheduledOrders.orders);
    
    // Calculate total items in cart
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.card.info.price ? item.card.info.price / 100 : item.card.info.defaultPrice / 100;
        return total + (price * item.quantity);
    }, 0);

    const CartTooltip = () => (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <h3 className="font-semibold text-gray-800 mb-2">Cart Summary</h3>
            <div className="space-y-2 mb-3">
                {cartItems.slice(0, 3).map((item) => (
                    <div key={item.card.info.id} className="flex justify-between text-sm">
                        <span className="truncate">{item.card.info.name}</span>
                        <span className="font-semibold">x{item.quantity}</span>
                    </div>
                ))}
                {cartItems.length > 3 && (
                    <div className="text-sm text-gray-500">
                        +{cartItems.length - 3} more items
                    </div>
                )}
            </div>
            <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <Link 
                to="/cart" 
                className="block w-full bg-orange-500 text-white text-center py-2 rounded-lg mt-3 hover:bg-orange-600 transition-colors"
                onClick={() => setShowCartTooltip(false)}
            >
                View Cart
            </Link>
        </div>
    );

    return (
        <div className='fixed flex justify-between top-0 left-0 bg-red-100 w-full px-7 sm:px-14 py-2 z-20 shadow-md'>
            <div>
                <Link href="/">
                    <img className='w-[150px] sm:w-[190px]' src={logo} alt='logo' />
                </Link>
            </div>

            <div className='flex items-center'>
                    <div className='flex items-center space-x-3 text-xl sm:hidden'>
                        
                        <div 
                            className="relative"
                            onMouseEnter={() => setShowCartTooltip(true)}
                            onMouseLeave={() => setShowCartTooltip(false)}
                        >
                            <Link to='/cart'>
                                <h1 className='font-semibold sm:font-bold w-11 text-center'>
                                    <span><FontAwesomeIcon icon={faCartShopping} /></span>
                                </h1>
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold cart-badge">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                            {showCartTooltip && totalItems > 0 && <CartTooltip />}
                        </div>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <FontAwesomeIcon icon={faBurger} />
                        </button>
                    </div>    
            </div>


            <div
                className={`fixed  top-0 right-0 w-2/4 h-full bg-red-100 z-30 transform transition-transform duration-300 ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } sm:hidden`}
            >
                <div className="flex flex-col pt-[80px] h-full space-y-1">
                    
                    <button className='absolute top-0 right-0 p-3 m-3 mr-5' 
                        onClick={() =>{setIsMenuOpen(false);
                    }}>
                        <FontAwesomeIcon icon={faXmark} className='w-5 h-5 p-1 text-white bg-black rounded-full' />
                    </button>

                    <div className='px-4 text-lg flex'>
                        <span className='px-1'><FontAwesomeIcon icon={faUser} /></span>
                        <span className='px-1 font-bold'>{loggedInUser}</span>
                    </div>
                    
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/grocery" onClick={() => setIsMenuOpen(false)}>TasteHub Grocery</Link>
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({totalItems})</Link>
                    <Link className="px-4 pt-3 text-lg font-semibold font-poppins" to="/scheduled-orders" onClick={() => setIsMenuOpen(false)}>Scheduled Orders ({scheduledOrders.length})</Link>
                    {/* <button
                        className='login-btn border border-transparent bg-green-300 rounded-md px-2 mx-2 w-20 flex-shrink-0'
                        onClick={() => {
                            setBtnValue(btnValue === 'Login' ? 'Logout' : 'Login');
                        }}
                    >
                        {btnValue}
                    </button> */}
                    
                </div>
            </div>

            <ul className='max-sm:hidden flex p-4 m-4 font-poppins font-[500]' >
                    {/* <li>
                    Online Status : {onlineStatus ? '🌝' : '🌑'}
                </li> */}   
                <li className='px-4'>
                    <Link to='/'>Home</Link>
                </li>
                <li className='px-4'>
                    {/* <a href='/about'>About</a> this will reload the page */}
                    <Link to='/about'>About</Link> {/* this will not reload the page */}
                </li>
                <li className='px-4'>
                    <Link to='/contact'>Contact</Link>
                </li>
                <li className='px-4'>
                    <Link to='/grocery'>TasteHub Grocery</Link>
                </li>
                <li className='px-4'>
                    <Link to='/scheduled-orders' className="relative">
                        <span>Scheduled Orders</span>
                        {scheduledOrders.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {scheduledOrders.length}
                            </span>
                        )}
                    </Link>
                </li>
                <li className='px-4'>
                    <div 
                        className="relative"
                        onMouseEnter={() => setShowCartTooltip(true)}
                        onMouseLeave={() => setShowCartTooltip(false)}
                    >
                        <Link to='/cart'>
                            <h1 className='font-bold w-11 text-center'>
                                <span><FontAwesomeIcon icon={faCartShopping} /></span>
                            </h1>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold cart-badge">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        {showCartTooltip && totalItems > 0 && <CartTooltip />}
                    </div>
                </li>
                    <div className='px-2 border border-solid border-black rounded-full cursor-pointer hover:bg-black hover:text-white'>
                        <span className='px-1'><FontAwesomeIcon icon={faUser} /></span>
                        <span className='px-1'>{loggedInUser}</span>
                    </div>
                    <button className='login-btn border border-transparent bg-green-300 rounded-sm px-2 mx-2 w-20 flex-shrink-0' onClick={()=>{
                        btnValue === "Login" ? setBtnValue('Logout') : setBtnValue('Login'); // ternary operator
                    }}>{btnValue}</button>
                   
            </ul>

        
        </div>
    );
};

export default Header;