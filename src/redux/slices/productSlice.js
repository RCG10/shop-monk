import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../actions/productActions";

const initialState = {
    products: [],
    isLoading: false,
    error: false,
    errorMsg:''
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.errorMsg = action.error.message;
            });
    },
});
export const getSelectedProducts = (state) => state.products.products;
export const getProductsLoading = (state) => state.products.isLoading;
export const getProductsError = (state) => state.products.error;

export default productsSlice.reducer;