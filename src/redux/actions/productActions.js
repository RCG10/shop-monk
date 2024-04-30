import { createAsyncThunk } from "@reduxjs/toolkit";
export const getProducts = createAsyncThunk('products/getProducts',
    async (payload, thunkApi) => {
        try {
            const url = `https://stageapibc.monkcommerce.app/admin/shop/product?search=${payload?.searchTerm}&page=${payload?.page}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            return response
        } catch (err) {
            return thunkApi.rejectWithValue(err);
        }
    }
)