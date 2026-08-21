import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  selectedCategoryId: string | null;
}

const initialState: CategoryState = {
  selectedCategoryId: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
