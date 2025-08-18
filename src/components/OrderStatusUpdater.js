import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../utils/slices/scheduledOrdersSlice';

const OrderStatusUpdater = () => {
    const dispatch = useDispatch();
    const scheduledOrders = useSelector((store) => store.scheduledOrders.orders);

    useEffect(() => {
        const checkAndUpdateOrders = () => {
            const now = new Date();
            
            scheduledOrders.forEach((order) => {
                if (order.status === 'scheduled') {
                    const scheduledTime = new Date(order.scheduledDateTime);
                    const preparingTime = new Date(scheduledTime.getTime() + 30 * 60 * 1000); // 30 minutes after
                    const deliveryTime = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // 1 hour after
                    
                    // Update to preparing after 30 minutes
                    if (now >= preparingTime && order.status === 'scheduled') {
                        dispatch(updateOrderStatus({ orderId: order.id, status: 'preparing' }));
                    }
                    
                    // Update to delivered after 1 hour
                    if (now >= deliveryTime && order.status === 'preparing') {
                        dispatch(updateOrderStatus({ orderId: order.id, status: 'delivered' }));
                    }
                }
            });
        };

        // Check every minute
        const interval = setInterval(checkAndUpdateOrders, 60000);
        
        // Initial check
        checkAndUpdateOrders();

        return () => clearInterval(interval);
    }, [scheduledOrders, dispatch]);

    // This component doesn't render anything
    return null;
};

export default OrderStatusUpdater;
