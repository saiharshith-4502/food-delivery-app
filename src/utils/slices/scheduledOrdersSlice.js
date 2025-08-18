import { createSlice } from '@reduxjs/toolkit';

const scheduledOrdersSlice = createSlice({
    name: 'scheduledOrders',
    initialState: {
        orders: [],
    },
    reducers: {
        addScheduledOrder: (state, action) => {
            const newOrder = {
                ...action.payload,
                id: Date.now().toString(),
                status: 'scheduled', // scheduled, preparing, delivered, cancelled
                createdAt: new Date().toISOString(),
            };
            state.orders.push(newOrder);
        },
        
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(order => order.id === orderId);
            if (order) {
                order.status = status;
                if (status === 'delivered') {
                    order.deliveredAt = new Date().toISOString();
                }
            }
        },
        
        cancelOrder: (state, action) => {
            const orderId = action.payload;
            const order = state.orders.find(order => order.id === orderId);
            if (order) {
                order.status = 'cancelled';
                order.cancelledAt = new Date().toISOString();
            }
        },
        
        clearCompletedOrders: (state) => {
            state.orders = state.orders.filter(order => 
                order.status !== 'delivered' && order.status !== 'cancelled'
            );
        },
    },
});

export const { 
    addScheduledOrder, 
    updateOrderStatus, 
    cancelOrder, 
    clearCompletedOrders 
} = scheduledOrdersSlice.actions;

export default scheduledOrdersSlice.reducer;
