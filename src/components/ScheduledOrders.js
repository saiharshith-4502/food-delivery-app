import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faClock, 
    faTrash, 
    faCheckCircle, 
    faTimesCircle, 
    faHourglassHalf,
    faTruck,
    faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { cancelOrder, clearCompletedOrders } from "../utils/slices/scheduledOrdersSlice";
import { CDN_URL } from '../utils/constants';

const ScheduledOrders = () => {
    const dispatch = useDispatch();
    const scheduledOrders = useSelector((store) => store.scheduledOrders.orders);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'scheduled':
                return <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />;
            case 'preparing':
                return <FontAwesomeIcon icon={faUtensils} className="text-orange-500" />;
            case 'delivered':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
            case 'cancelled':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
            default:
                return <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-orange-100 text-orange-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'scheduled':
                return 'Your order is scheduled and will be prepared at the scheduled time';
            case 'preparing':
                return 'Your order is being prepared by the restaurant';
            case 'delivered':
                return 'Your order has been delivered successfully';
            case 'cancelled':
                return 'Your order has been cancelled';
            default:
                return 'Order status unknown';
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
    };

    const handleCancelOrder = (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            dispatch(cancelOrder(orderId));
        }
    };

    const handleClearCompleted = () => {
        if (window.confirm('Are you sure you want to clear all completed orders?')) {
            dispatch(clearCompletedOrders());
        }
    };

    const sortedOrders = [...scheduledOrders].sort((a, b) => {
        // Sort by scheduled time, then by creation time
        const aTime = new Date(a.scheduledDateTime);
        const bTime = new Date(b.scheduledDateTime);
        return aTime - bTime;
    });

    return (
        <div className="pt-[80px] mx-10 sm:mx-56 sm:my-7 overflow-y-auto h-screen scrollbar-hide">
            <div className="m-2 p-2 sm:m-3 sm:p-3">
                <h1 className="text-4xl font-poppins font-bold text-center">My Scheduled Orders</h1>
            </div>

            {scheduledOrders.length === 0 ? (
                <div className="text-center py-10">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-6xl text-gray-400 mb-4" />
                    <h1 className="text-xl font-poppins text-gray-600 font-semibold">No Scheduled Orders</h1>
                    <p className="text-gray-500 mt-2">You haven't scheduled any orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header with clear button */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Total Orders: {scheduledOrders.length}
                        </h2>
                        <button 
                            onClick={handleClearCompleted}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Clear Completed
                        </button>
                    </div>

                    {sortedOrders.map((order) => {
                        const scheduledTime = formatDateTime(order.scheduledDateTime);
                        const createdTime = formatDateTime(order.createdAt);
                        
                        return (
                            <div key={order.id} className="bg-white rounded-lg p-6 shadow-md border">
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Order #{order.id.slice(-6)}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Created: {createdTime.date} at {createdTime.time}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        {order.status === 'scheduled' && (
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Cancel Order"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Status Message */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 text-sm">
                                        {getStatusMessage(order.status)}
                                    </p>
                                </div>

                                {/* Scheduled Time */}
                                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <FontAwesomeIcon icon={faClock} />
                                        <span className="font-semibold">Scheduled for:</span>
                                        <span>{scheduledTime.date} at {scheduledTime.time}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Order Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.card.info.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                                <img 
                                                    className="w-12 h-12 object-cover rounded"
                                                    src={CDN_URL + item.card.info.imageId}
                                                    alt={item.card.info.name}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.card.info.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-gray-800">
                                                    ₹{(item.card.info.price ? item.card.info.price / 100 : item.card.info.defaultPrice / 100) * item.quantity}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Total */}
                                <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded">
                                    <span className="font-semibold text-gray-800">Total Amount:</span>
                                    <span className="text-xl font-bold text-gray-800">₹{order.totalPrice.toFixed(2)}</span>
                                </div>

                                {/* Delivery Info */}
                                {order.deliveredAt && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <FontAwesomeIcon icon={faTruck} />
                                            <span className="font-semibold">Delivered on:</span>
                                            <span>{formatDateTime(order.deliveredAt).date} at {formatDateTime(order.deliveredAt).time}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Cancellation Info */}
                                {order.cancelledAt && (
                                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <FontAwesomeIcon icon={faTimesCircle} />
                                            <span className="font-semibold">Cancelled on:</span>
                                            <span>{formatDateTime(order.cancelledAt).date} at {formatDateTime(order.cancelledAt).time}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ScheduledOrders;
