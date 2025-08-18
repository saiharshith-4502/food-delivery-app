import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import scheduledOrdersSlice from './slices/scheduledOrdersSlice';

const appStore = configureStore({
    reducer: {
        cart: cartSlice,
        scheduledOrders: scheduledOrdersSlice,
    },
});

export default appStore;