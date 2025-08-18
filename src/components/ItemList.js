import { CDN_URL } from '../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleStop } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../utils/slices/cartSlice'
import { useState } from 'react';

const ItemList = ({items}) => {
    
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddItems = (item) => {
    dispatch(addItem(item));
    setToastMessage(`${item.card.info.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  const handleRemoveItems = (itemId) => {
    dispatch(removeItem(itemId));
  }

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.card.info.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }
    
  return (
    <div>
        {/* Toast Notification */}
        {showToast && (
            <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} />
                    <span>{toastMessage}</span>
                </div>
            </div>
        )}

        {items.map((item) => {
            const quantity = getItemQuantity(item.card.info.id);
            return (
                <div
                    className=" relative  bg-slate-100 rounded-lg p-3 my-3 hover:bg-slate-200 cursor-pointer transition-all duration-200" 
                    key={item.card.info.id}
                >
                    <div className="flex items-center flex-row relative p-2"> 
                        <img className="w-36 h-36 sm:w-3/12 sm:h-56 object-cover object-center rounded-lg"
                            src={CDN_URL + item.card.info.imageId}
                            alt="food-item"
                        />
                         

                        <div className="sm:w-9/12 flex flex-col m-4 p-4 justify-center">
                            <h2 className="text-md sm:text-3xl font-poppins font-semibold">{item.card.info.name}</h2>
                            <h4 className="text-md sm:text-lg font-palanquin ">{'\u20B9'} {item.card.info.price ?  item.card.info.price / 100 : item.card.info.defaultPrice /100}</h4>
                            <p className='hidden sm:flex font-poppins text-md pt-7'>
                                {item.card.info.description}
                            </p>
                        </div>

                        <div className="" key={item.card.info.id}>
                            <h4 
                                className={`absolute right-0 top-0 ${item.card.info.itemAttribute.vegClassifier === "VEG" ? "text-green-600" : "text-red-700"}`}
                            >
                                    
                                <FontAwesomeIcon  icon={faCircleStop} />
                            </h4>
                        </div>

                      
                    </div>
                      
                    <div className="absolute left-1 bottom-3 flex items-center gap-2 ml-2">
                        {quantity > 0 && (
                            <>
                                <button 
                                    className="border border-solid border-transparent bg-orange-100 text-black p-2 rounded-lg hover:bg-orange-200 transition-colors"
                                    onClick={() => handleRemoveItems(item.card.info.id)}
                                >
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <span className="bg-white px-3 py-2 rounded-lg font-semibold text-lg min-w-[40px] text-center shadow-sm">
                                    {quantity}
                                </span>
                            </>
                        )}
                        <button 
                            className="border border-solid border-transparent bg-orange-100 text-black p-2 rounded-lg hover:bg-orange-200 transition-colors"
                            onClick={() => handleAddItems(item)}
                        >
                            <div className='' >
                                <h4 className='text-sm sm:text-lg'>
                                    {quantity === 0 ? 'Add' : ''} <span> <FontAwesomeIcon icon={faPlus} /></span>
                                </h4>
                            </div>    
                        </button>  
                    </div>
                    
                </div>  
            );
        })}


    </div>
  )
}

export default ItemList