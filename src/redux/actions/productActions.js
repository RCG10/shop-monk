import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (payload, thunkApi) => {
        try {
            const url = `https://stageapi.monkcommerce.app/task/products/search?search=${payload?.searchTerm}&page=${payload?.page}&limit=1`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    'x-api-key': '72njgfa948d9aS7gs5'
                },
                redirect:"follow"
            });
            const response = await res.json();
            return response;
        } catch (err) {
            return thunkApi.rejectWithValue(err.message);
        }
    }
);
