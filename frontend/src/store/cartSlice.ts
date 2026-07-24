import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartLine {
  productId: string;
  variantId?: string;
  size?: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartLine>) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId && item.variantId === action.payload.variantId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      state.items = state.items.filter(
        (item) => !(item.productId === action.payload.productId && item.variantId === action.payload.variantId)
      );
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId && i.variantId === action.payload.variantId
      );
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.items = [];
    },
    toggleDrawer(state, action: PayloadAction<boolean | undefined>) {
      state.isDrawerOpen = action.payload ?? !state.isDrawerOpen;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, toggleDrawer } = cartSlice.actions;
export default cartSlice.reducer;
