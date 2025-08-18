import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
    },
    reducers:{
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.card.info.id === newItem.card.info.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...newItem, quantity: 1 });
            }
        },

        removeItem: (state, action) => {
            const itemId = action.payload;
            const existingItem = state.items.find(item => item.card.info.id === itemId);
            
            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item.card.info.id !== itemId);
                } else {
                    existingItem.quantity -= 1;
                }
            }
        },

        removeItemCompletely: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.card.info.id !== itemId);
        },

        clearCart: (state) => {
            state.items = [];
        },
    },   
});

export const { addItem, removeItem, removeItemCompletely, clearCart } = cartSlice.actions;
export default cartSlice.reducer;