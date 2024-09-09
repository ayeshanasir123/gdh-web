import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ECONOMY_FLIGHT_CLASS,
  ROUND_TRIP_FLIGHT_TYPE,
} from "@/constants/flights";
import { IFlightSearchForm } from "@/interfaces/flights/IFlightSearchForm";

const flightSearchFormInitialState: IFlightSearchForm = {
  flyingFrom: {
    name: "",
    code: "",
  },

  destinationTo: {
    name: "",
    code: "",
  },

  flightDepartureDate: null || "",

  returnDate: null || "",

  flightReturnDate: [null || "", null || ""],

  flightType: ROUND_TRIP_FLIGHT_TYPE,

  flightClass: { name: ECONOMY_FLIGHT_CLASS, code: "Y" },

  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
};

const flightSearchFormSlice = createSlice({
  name: "flight",
  initialState: flightSearchFormInitialState,
  reducers: {
    flyingFrom: (state, action: PayloadAction<{ name: string; code: string }>) => {
      state.flyingFrom = action.payload;
    },

    destinationTo: (state, action: PayloadAction<{ name: string; code: string }>) => {
      state.destinationTo = action.payload;
    },

    flightDepartureDate: (state, action: PayloadAction<string | null>) => {
      state.flightDepartureDate = action.payload;
    },

    returnDate: (state, action: PayloadAction<string | null>) => {
      state.returnDate = action.payload;
    },

    flightReturnDate: (state, action: PayloadAction<[string | null, string | null]>) => {
      state.flightReturnDate = action.payload;
    },

    flightType: (state, action: PayloadAction<string>) => {
      state.flightType = action.payload;
    },

    flightClass: (state, action: PayloadAction<{ name: string; code: string }>) => {
      state.flightClass = action.payload;
    },

    incrementAdults: (state) => {
      if (state.passengers.adults < 8) {
        state.passengers.adults += 1;
      }
    },

    decrementAdults: (state) => {
      if (state.passengers.adults > 1) {
        state.passengers.adults -= 1;
      }
    },

    incrementChildren: (state) => {
      if (state.passengers.children < 8) {
        state.passengers.children += 1;
      }
    },

    decrementChildren: (state) => {
      if (state.passengers.children > 0) {
        state.passengers.children -= 1;
      }
    },

    incrementInfants: (state) => {
      if (state.passengers.infants < 8) {
        state.passengers.infants += 1;
      }
    },

    decrementInfants: (state) => {
      if (state.passengers.infants > 0) {
        state.passengers.infants -= 1;
      }
    },

    
    swapFlight: (state) => {
      const temp = state.flyingFrom;
      state.flyingFrom = state.destinationTo;
      state.destinationTo = temp;
    },
  },
});

export const {
  flyingFrom,
  destinationTo,
  flightDepartureDate,
  returnDate,
  flightReturnDate,
  flightType,
  flightClass,
  incrementAdults,
  decrementAdults,
  incrementChildren,
  decrementChildren,
  incrementInfants,
  decrementInfants,
  swapFlight,
} = flightSearchFormSlice.actions;

export default flightSearchFormSlice.reducer;
