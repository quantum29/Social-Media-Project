import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
// for storing in local state // user closes the tab or browser the user information will be still be stored and only way to get rid is to clear the cache  
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);


// Configure the Redux store with middleware
//reducer of component -> contains actions (action called then reducer called with action(action changed the states those states are stores))
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root")); //ReactDom is related to the real dom


// Render the main application component with Redux Provider and Redux-Persist
root.render(
  // Wrap the entire application in React.StrictMode for additional development features and warnings
  <React.StrictMode>
    {/* 
    Use the Provider component from React-Redux to make the Redux store accessible 
    to all components in the application.
  */}
    <Provider store={store}>
      {/* 
      The PersistGate delays rendering until the persisted state has been retrieved 
      and saved to the Redux store. The `loading` prop can be used for a loading indicator.
    */}
      <PersistGate loading={null} persistor={persistStore(store)}>
        {/* 
        Render the main application component. It will have access to the Redux store 
        due to the Provider wrapping.
      */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)



//redux  store action reducer 
// provider -> initialized store we are making actual store in redux to make available for all elements

