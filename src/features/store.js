import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authApi } from "../services/authApi/authApi";
import { communityApi } from "../services/communityApi/communityApi";
import { userApi } from "../services/userApi/userApi";
import { dashboardApi } from "../services/dashboardApi/dashboardApi";
import { reportsApi } from "../services/reportsApi/reportsApi";
import { transactionHistoryApi } from "../services/transactionHistoryApi/transactionHistoryApi";
import { reportedProductsApi } from "../services/reportedProductsApi/reportedProductsApi";
import { notificationsApi } from "../services/notificationsApi/notificationsApi";
import userReducer from "./userSlice/userSlice";
import { productsApi } from "../services/productsApi/productsApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [transactionHistoryApi.reducerPath]: transactionHistoryApi.reducer,
    [reportedProductsApi.reducerPath]: reportedProductsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      communityApi.middleware,
      dashboardApi.middleware,
      reportsApi.middleware,
      transactionHistoryApi.middleware,
      reportedProductsApi.middleware,
      notificationsApi.middleware,
      productsApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
