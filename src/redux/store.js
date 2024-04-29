import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productSlice";

const rootReducer = combineReducers({
    products: productSlice
})
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
})