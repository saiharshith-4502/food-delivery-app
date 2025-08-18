import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faTrash, faMinus, faPlus, faCalendarAlt, faClock, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux"
import { clearCart, removeItem, addItem, removeItemCompletely } from "../utils/slices/cartSlice"
import { addScheduledOrder } from "../utils/slices/scheduledOrdersSlice"
import { useEffect, useState } from "react";
import { CDN_URL } from '../utils/constants'

const Cart = () => {

    //subscribe to the store
    const cartItems = useSelector((store) => store.cart.items);
    const dispatch = useDispatch();
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [orderType, setOrderType] = useState('immediate'); // 'immediate' or 'scheduled'

    useEffect(() => {
        // Toggle scroll bar visibility based on cart items
        if (cartItems.length > 0) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [cartItems]);

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    const handleRemoveItem = (itemId) => {
        dispatch(removeItem(itemId));
    }

    const handleAddItem = (item) => {
        dispatch(addItem(item));
    }

    const handleRemoveItemCompletely = (itemId) => {
        dispatch(removeItemCompletely(itemId));
    }

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = item.card.info.price ? item.card.info.price / 100 : item.card.info.defaultPrice / 100;
            return total + (price * item.quantity);
        }, 0);
    }

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = calculateTotalPrice();

    // Generate next 7 days for date selection
    const getNext7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                isToday: i === 0
            });
        }
        return dates;
    }

    // Generate time slots (every 30 minutes from 6 AM to 11 PM)
    const getTimeSlots = (selectedDate) => {
        const slots = [];
        const now = new Date();
        const isToday = selectedDate === now.toISOString().split('T')[0];
        
        for (let hour = 6; hour <= 23; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // If it's today, only show future times
                if (isToday) {
                    const timeToCheck = new Date();
                    const [hours, minutes] = timeString.split(':');
                    timeToCheck.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    
                    // Add 30 minutes buffer to current time
                    const bufferTime = new Date(now.getTime() + 30 * 60 * 1000);
                    
                    if (timeToCheck > bufferTime) {
                        slots.push(timeString);
                    }
                } else {
                    slots.push(timeString);
                }
            }
        }
        return slots;
    }

    const handleProceedToCheckout = () => {
        if (orderType === 'scheduled') {
            setShowScheduleModal(true);
        } else {
            // Handle immediate checkout
            alert('Proceeding with immediate checkout...');
            dispatch(clearCart());
        }
    }

    const handleScheduleOrder = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time for scheduled order');
            return;
        }
        
        const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
        const now = new Date();
        
        if (scheduledDateTime <= now) {
            alert('Please select a future date and time');
            return;
        }

        // Create the scheduled order object
        const scheduledOrder = {
            items: cartItems,
            totalPrice,
            scheduledDateTime: scheduledDateTime.toISOString(),
            orderType: 'scheduled'
        };

        // Add to scheduled orders store
        dispatch(addScheduledOrder(scheduledOrder));

        // Set up automatic status updates
        const preparingTime = new Date(scheduledDateTime.getTime() + 30 * 60 * 1000); // 30 minutes after scheduled time
        const deliveryTime = new Date(scheduledDateTime.getTime() + 60 * 60 * 1000); // 1 hour after scheduled time
        
        // Schedule status updates
        setTimeout(() => {
            // This would typically be handled by a backend service
            // For demo purposes, we'll just show a notification
            console.log('Order should now be preparing');
        }, preparingTime.getTime() - now.getTime());

        setTimeout(() => {
            // This would typically be handled by a backend service
            // For demo purposes, we'll just show a notification
            console.log('Order should now be delivered');
        }, deliveryTime.getTime() - now.getTime());

        alert(`Order scheduled for ${selectedDate} at ${selectedTime}. You can track your order in the Scheduled Orders section.`);
        setShowScheduleModal(false);
        dispatch(clearCart());
    }

    const ScheduleModal = () => (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
            <div className="modal-content animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Schedule Your Order</h2>
                    <button 
                        onClick={() => setShowScheduleModal(false)}
                        className="modal-close"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="schedule-info">
                    <p className="schedule-info-text">
                        🕒 Schedule your order for the next 7 days
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Date Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            Select Date
                        </label>
                        <select 
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime(''); // Reset time when date changes
                            }}
                            className="form-select"
                        >
                            <option value="">Choose a date</option>
                            {getNext7Days().map((date) => (
                                <option key={date.value} value={date.value}>
                                    {date.label} {date.isToday ? '(Today)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Time Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            Select Time
                        </label>
                        <select 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="form-select"
                            disabled={!selectedDate}
                        >
                            <option value="">
                                {selectedDate ? 'Choose a time' : 'Please select a date first'}
                            </option>
                            {selectedDate && getTimeSlots(selectedDate).map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {selectedDate && getTimeSlots(selectedDate).length === 0 && (
                            <p className="text-red-500 text-sm mt-1">
                                No available time slots for today. Please select a future date.
                            </p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3 className="order-summary-title">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="order-summary-item">
                                <span>Total Items:</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="order-summary-item">
                                <span>Total Amount:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            {selectedDate && selectedTime && (
                                <div className="order-summary-item">
                                    <span>Scheduled for:</span>
                                    <span>{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="btn-group">
                        <button 
                            onClick={() => setShowScheduleModal(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleScheduleOrder}
                            className="btn btn-primary"
                            disabled={!selectedDate || !selectedTime}
                        >
                            Schedule Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="pt-[80px] mx-10 sm:mx-56 sm:my-7 overflow-y-auto h-screen scrollbar-hide">
            <div className="m-2 p-2 sm:m-3 sm:p-3">
                <h1 className="text-4xl font-poppins font-bold text-center">My Cart</h1>
            </div>
            <div className="my-1 flex justify-between items-center">
                <h4 className="font-palanquin text-lg">
                    <span className="font-bold">{totalItems}</span> Items
                </h4>
                {cartItems.length > 0 && (
                    <button className="border border-solid text-white font-bold bg-black p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            onClick={handleClearCart}>
                        <h4>Empty Cart <span><FontAwesomeIcon icon={faCartShopping} /></span></h4>
                    </button>
                )}
            </div>
            
            <div className="items-center pt-2">
                {cartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <FontAwesomeIcon icon={faCartShopping} className="text-6xl text-gray-400 mb-4" />
                        <h1 className="text-xl font-poppins text-gray-600 font-semibold">Cart is Empty</h1>
                        <p className="text-gray-500 mt-2">Please add items to your cart</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.card.info.id} className="bg-white rounded-lg p-4 shadow-md border">
                                <div className="flex items-center gap-4">
                                    <img 
                                        className="w-20 h-20 object-cover rounded-lg"
                                        src={CDN_URL + item.card.info.imageId}
                                        alt={item.card.info.name}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{item.card.info.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            ₹{item.card.info.price ? item.card.info.price / 100 : item.card.info.defaultPrice / 100}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Total: ₹{(item.card.info.price ? item.card.info.price / 100 : item.card.info.defaultPrice / 100) * item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                                            onClick={() => handleRemoveItem(item.card.info.id)}
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                        </button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <button 
                                            className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                                            onClick={() => handleAddItem(item)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                        </button>
                                        <button 
                                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                                            onClick={() => handleRemoveItemCompletely(item.card.info.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div className="bg-white rounded-lg p-4 shadow-md border mt-6">
                            <div className="flex justify-between items-center text-xl font-semibold mb-4">
                                <span>Total Amount:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            {/* Order Type Selection */}
                            <div className="mb-4">
                                <label className="form-label">
                                    Order Type:
                                </label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input 
                                            type="radio" 
                                            name="orderType" 
                                            value="immediate"
                                            checked={orderType === 'immediate'}
                                            onChange={(e) => setOrderType(e.target.value)}
                                            className="radio-input"
                                        />
                                        <span>Immediate</span>
                                    </label>
                                    <label className="radio-option">
                                        <input 
                                            type="radio" 
                                            name="orderType" 
                                            value="scheduled"
                                            checked={orderType === 'scheduled'}
                                            onChange={(e) => setOrderType(e.target.value)}
                                            className="radio-input"
                                        />
                                        <span>Scheduled</span>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="btn-group">
                                <button 
                                    onClick={handleProceedToCheckout}
                                    className="btn btn-primary"
                                >
                                    {orderType === 'scheduled' ? 'Schedule Order' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && <ScheduleModal />}
        </div>
    )
}

export default Cart; 