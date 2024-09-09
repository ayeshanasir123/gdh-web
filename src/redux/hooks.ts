// "use client";
// import { useDispatch, useSelector, useStore } from "react-redux";
// import type { RootState, AppDispatch, AppStore } from "./store";

// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppSelector = useSelector.withTypes<RootState>();
// export const useAppStore = useStore.withTypes<AppStore>();
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Custom hooks with TypeScript types
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
