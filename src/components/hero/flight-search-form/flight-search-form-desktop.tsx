/* eslint-disable react/display-name */
"use client";
import "react-datepicker/dist/react-datepicker.css";


import "./custom-react-calendar.css";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import ImageTextBasicComponent from "../ImageTextBasicComponent";
import Image from "next/image";
// import * as dayjs from "dayjs";

import {
  incrementAdults,
  decrementAdults,
  incrementChildren,
  decrementChildren,
  flightDepartureDate,
  returnDate,
  flightReturnDate,
  destinationTo,
  flightClass,
  flightType,
  flyingFrom,
  decrementInfants,
  incrementInfants,
  swapFlight,
} from "@/redux/features/flights/flight-search-form-slice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BUSINESS_FLIGHT_CLASS,
  ECONOMY_FLIGHT_CLASS,
  FIRST_FLIGHT_CLASS,
  ONE_WAY_FLIGHT_TYPE,
  ROUND_TRIP_FLIGHT_TYPE,
} from "@/constants/flights";

import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";

import { usePathname, useRouter } from "next/navigation";

import airports from "@/data/airports-with-city-country-iata-data.json";

import { useGetAvailableFlightsMutation } from "@/redux/services/flights/flight-api";

import {
  setAvailableFlights,
  setMessage,
  setSuccess,
} from "@/redux/features/flights/get-available-flights-slice";

import "react-calendar/dist/Calendar.css";
import "./custom-react-calendar.css";

import { IFilteredAirports } from "@/interfaces/IFilteredAirPorts";
import { IFlightSearchForm } from "@/interfaces/flights/IFlightSearchForm";
import DatePicker from "react-datepicker";
import { CalendarContainer } from "react-datepicker";
import dayjs from "dayjs";

const FlightSearchFormDesktop = () => {
  const flightState = useAppSelector((state: RootState) => state.flight);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const calendarRef = useRef<any>(null);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [rightCalendarMonth, setRightCalendarMonth] = useState(dayjs().add(1, 'month').toDate());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datesSelected, setDatesSelected] = useState(false);

  const dispatch = useAppDispatch();
  // const dispatches = useDispatch();
  // const dispatch = useDispatch<useAppDispatch>();
  const currentPath = usePathname();
  const [localState, setLocalState] = useState({
    flyingFrom: flightState.flyingFrom,
    destinationTo: flightState.destinationTo,
  });

  const today = new Date();
    const [leftMonth, setLeftMonth] = useState(new Date());

  const [getAvailableFlights, { data, error, isLoading }] =
    useGetAvailableFlightsMutation();
    // const calendarRef = useRef<any>(null);

   
    // const handleDateChange = (dates: [Date | null, Date | null]) => {
    //   const [start, end] = dates;
    //   setStartDate(start);
    //   setEndDate(end);
    //   setCalendarOpen(false);
    // };
    const handleDateChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
  
      if (start && end) {
        setDatesSelected(true);
      }
    };
    const onewayDateChange = (date) => {
      setStartDate(date);
      setCalendarOpen(false); // Close the calendar after selecting the start date
    };
  
    const SubmitCalender = () => {
      setCalendarOpen(false);
    
      // Log the selected dates
      console.log("Departure Date:", startDate?.toISOString().split("T")[0]);
      console.log("Return Date:", endDate?.toISOString().split("T")[0]);
    
      // Add your form submission logic here
    };
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<IFlightSearchForm>({
    defaultValues: {
      flyingFrom: { name: "", code: "" },
      destinationTo: { name: "", code: "" },
      flightDepartureDate: today.toISOString().split("T")[0],
    },
  });

  const router = useRouter();

  // Input Fields Dropdowns
  const [flyingFromDropDown, setFlyingFromDropDown] = useState(false);
  const [destinationToDropDown, setDestinationToDropDown] = useState(false);
  const [showDepartureDate, setShowDepartureDate] = useState(false);
  const [showReturnDate, setShowReturnDate] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSwap = () => {
    console.log('Flying from:', flightState.flyingFrom.name);
    console.log('Destination to:', flightState.destinationTo.name);
  
  
    dispatch(swapFlight());
  
  
  };

  // Submit Form Starts
  const submitFlightForm: SubmitHandler<IFlightSearchForm> = async () => {
    try {
      let response;
      if (flightState.flightType === ROUND_TRIP_FLIGHT_TYPE) {
        response = await getAvailableFlights({
          numAdult: flightState.passengers.adults,
          numChild: flightState.passengers.children,
          numInfant: flightState.passengers.infants,
          cabinType: flightState.flightClass.code,
          tripType: flightState.flightType,
          legs: [
            {
              origin: flightState.flyingFrom.code,
              destination: flightState.destinationTo.code,
              departureDate: flightState.flightReturnDate[0],
            },
            {
              origin: flightState.destinationTo.code,
              destination: flightState.flyingFrom.code,
              departureDate: flightState.flightReturnDate[1],
            },
          ],
        }).unwrap();
      } else {
        response = await getAvailableFlights({
          numAdult: flightState.passengers.adults,
          numChild: flightState.passengers.children,
          numInfant: flightState.passengers.infants,
          cabinType: flightState.flightClass.code,
          tripType: flightState.flightType,
          legs: [
            {
              origin: flightState.flyingFrom.code,
              destination: flightState.destinationTo.code,
              departureDate: flightState.flightDepartureDate,
            },
          ],
        }).unwrap();
      }

      dispatch(setSuccess(response?.success));
      dispatch(setMessage(response?.message));
      dispatch(setAvailableFlights(response?.data?.flights));
    } catch (error) {
      console.error("Error in getting flights", error);
    }

    if (error) {
      console.error("Error in getting flights", error);
    } else {
      router.push("/flights/search-results");
    }
  };
  // Submit Form Ends

  const onFlightSearchFormSubmitError = (
    errors: FieldErrors<IFlightSearchForm>,
  ) => {
    console.log("Errors in Flight Form: ", errors);
  };

  const [filteredCities, setFilteredCities] = useState<IFilteredAirports[]>([]);

  const handleFlyingFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredCity = airports.filter((airport) => {
      // Airport: name, city, country, iata
      if (airport?.name !== "") {
        return (
          airport?.name.toLowerCase().includes(value.toLowerCase()) ||
          airport?.city.toLowerCase().includes(value.toLowerCase()) ||
          airport?.country.toLowerCase().includes(value.toLowerCase()) ||
          airport?.iata.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    dispatch(flyingFrom({ name: value, code: "" }));

    if (errors?.flyingFrom?.name) {
      clearErrors("flyingFrom.name");
    }

    setFilteredCities(filteredCity);
  };

  const handleFlyingFromCityClick = (airport: IFilteredAirports) => {
    dispatch(flyingFrom({ name: airport?.name, code: airport?.iata }));

    setFilteredCities([]);

    setFlyingFromDropDown(false);
    setDestinationToDropDown(false);
  };
  useEffect(() => {
    // Ensure currentMonth is set to the current month and year
    // setCurrentMonth(new Date());
  }, []);
  const handleDestinationToChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    const filteredCity = airports.filter((airport) => {
      // Airport: name, city, country, iata
      if (airport?.name !== "") {
        return (
          airport?.name.toLowerCase().includes(value.toLowerCase()) ||
          airport?.city.toLowerCase().includes(value.toLowerCase()) ||
          airport?.country.toLowerCase().includes(value.toLowerCase()) ||
          airport?.iata.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    dispatch(destinationTo({ name: value, code: "" }));

    if (errors?.destinationTo?.name) {
      clearErrors("destinationTo.name");
    }

    setFilteredCities(filteredCity);
  };

  const handleDestinationToCityClick = (airport: IFilteredAirports) => {
    dispatch(destinationTo({ name: airport.name, code: airport.iata }));
    setFilteredCities([]);
    setDestinationToDropDown(false);
    setFlyingFromDropDown(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Image
          src="/assets/images/gdh-logo.svg"
          alt="Getdirectholidays Logo"
          width={300}
          height={46}
          className="h-[46px] w-[300px]"
        />

        <div className="loader h-16 w-16 animate-spin rounded-full border-8 border-t-8 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p>Error in Fetching Flights</p>;
  }

  const CustomCalendarInput = forwardRef(({ value, onClick }: any, ref) => (
    <div onClick={onClick}>
      <input
        ref={ref as any}
        type="text"
        placeholder="Departure Date"
        value={value}
        onClick={onClick}
        className=" h-full items-center  py-2 pl-3 pr-2 outline-none placeholder:text-[16px]"
        style={{ backgroundColor: "red" }}
      />
    </div>
  ));

  return (
    <div className="rounded-[10px] bg-white px-8 pb-14 pt-8">
      <form
        id="flight-search-form-desktop"
        onSubmit={handleSubmit(submitFlightForm, onFlightSearchFormSubmitError)}
      >
        {/* Flight Search Form Dropdowns */}
        <div
          id="flight-search-form-dropdowns-desktop"
          className="flex items-center gap-10"
        >
          {/* Flight Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src="/assets/icons/plane-icon.svg"
                  alt="Icon for Trip Type"
                  width={14}
                  height={14}
                />
                <span className="text-[14px] font-[500] text-darkBlue">
                  {flightState.flightType}
                </span>
                <Image
                  src="/assets/icons/drop-down-icon.svg"
                  alt="Dropdown Icon"
                  height={4}
                  width={8}
                  className="height-[4px] w-[8px]"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Trip Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem
                  value="one-way"
                  onClick={() => dispatch(flightType(ONE_WAY_FLIGHT_TYPE))}
                >
                  One Way
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="round-trip"
                  onClick={() => dispatch(flightType(ROUND_TRIP_FLIGHT_TYPE))}
                >
                  Round Trip
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom Passengers Dropdown */}
          <div
            className="relative flex cursor-pointer items-center gap-2 text-[14px] font-[500] text-[#10294D]"
            onClick={() => toggleDropdown("passenger")}
          >
            <ImageTextBasicComponent
              text={`${flightState?.passengers?.adults} Adults, ${flightState?.passengers?.children} Children, ${flightState.passengers?.infants} Infants`}
              img="/assets/icons/passengers-icon.svg"
              height={14}
              width={14}
              gap={2}
            />

            <Image
              src="/assets/icons/drop-down-icon.svg"
              alt="drop-down-icon"
              height={4}
              width={8}
              className={`h-auto w-auto transition-transform ${
                openDropdown === "passenger" ? "rotate-180" : "rotate-0"
              }`}
            />

            {openDropdown === "passenger" && (
              <div
                className="absolute left-0 top-full z-20 mt-2 h-auto w-[284px] rounded-lg border bg-white p-4 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {/* Adults */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="mt-3">
                    <p className="text-[16px] font-semibold text-darkBlue">
                      Adults
                    </p>
                    <p className="text-[14px] text-inActive">Aged 11+</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] p-2 text-white"
                      onClick={() => dispatch(decrementAdults())}
                    >
                      <Image
                        src="/assets/icons/minus-icon.svg"
                        alt="Decrement Adults Button"
                        width={14}
                        height={14}
                      />
                    </button>
                    <div className="flex h-7 w-7 items-center justify-center text-lg font-bold text-darkBlue">
                      {flightState?.passengers?.adults}
                    </div>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] p-2 text-white"
                      onClick={() => dispatch(incrementAdults())}
                    >
                      <Image
                        src="/assets/icons/plus-icon.svg"
                        alt="Increment Adults Button"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="mt-2">
                    <p className="text-[16px] font-semibold text-darkBlue">
                      Children
                    </p>
                    <p className="text-[14px] text-inActive">Aged 0 to 11</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] text-white"
                      onClick={() => dispatch(decrementChildren())}
                    >
                      <Image
                        src="/assets/icons/minus-icon.svg"
                        alt="decrement"
                        width={18}
                        height={14}
                      />
                    </button>
                    <div className="flex h-7 w-7 items-center justify-center text-lg font-bold text-darkBlue">
                      {flightState?.passengers?.children}
                    </div>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] text-white"
                      onClick={() => dispatch(incrementChildren())}
                    >
                      <Image
                        src="/assets/icons/plus-icon.svg"
                        alt="increment"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>

                {/* Infants  */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="mt-2">
                    <p className="text-[16px] font-semibold text-darkBlue">
                      Infants
                    </p>
                    <p className="text-[14px] text-inActive">
                      Aged 0 to 2 Years
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] p-2 text-white"
                      onClick={() => dispatch(decrementInfants())}
                    >
                      <Image
                        src="/assets/icons/minus-icon.svg"
                        alt="Decrement Infants Button"
                        width={14}
                        height={14}
                      />
                    </button>
                    <div className="flex h-7 w-7 items-center justify-center text-lg font-bold text-darkBlue">
                      {flightState?.passengers?.infants}
                    </div>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10294D] p-2 text-white"
                      onClick={() => dispatch(incrementInfants())}
                    >
                      <Image
                        src="/assets/icons/plus-icon.svg"
                        alt="Increment Infants Button"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-[12px] text-inActive">
                  Your age at the time of travel must be valid for the age
                  category booked. Airlines have restrictions on under 18s
                  traveling alone.
                </p>
                <p className="mt-6 text-[12px] text-inActive">
                  Age limits and policies for traveling with children may vary
                  so please check with the airline before checking.
                </p>
              </div>
            )}
          </div>

          {/* Flight Class Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src="/assets/icons/seat-icon.svg"
                  alt="Icon for Flight Class"
                  width={14}
                  height={14}
                />
                <span className="text-[14px] font-[500] text-darkBlue">
                  {flightState.flightClass.name}
                </span>
                <Image
                  src="/assets/icons/drop-down-icon.svg"
                  alt="Dropdown Icon"
                  height={4}
                  width={8}
                  className="height-[4px] w-[8px]"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Flight Class</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem
                  value="business-class"
                  onClick={() =>
                    dispatch(
                      flightClass({ name: BUSINESS_FLIGHT_CLASS, code: "J" }),
                    )
                  }
                >
                  Business Class
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="economy-class"
                  onClick={() =>
                    dispatch(
                      flightClass({ name: ECONOMY_FLIGHT_CLASS, code: "Y" }),
                    )
                  }
                >
                  Economy Class
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="first-class"
                  onClick={() =>
                    dispatch(
                      flightClass({ name: FIRST_FLIGHT_CLASS, code: "F" }),
                    )
                  }
                >
                  First Class
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Flight Search Form Input Fields */}
        <div id="flight-search-form-inputs-desktop" className="mt-8">
          <div className="flex gap-3">
            {/* Flying from input field */}
            <div
              className="relative flex-grow"
              onClick={() => {
                setFlyingFromDropDown(!flyingFromDropDown);
                setDestinationToDropDown(false);
              }}
            >
              <div
                className={`flex h-12 items-center gap-3 rounded border ${errors.flyingFrom ? "border-red-500" : ""} py-2 pl-3`}
              >
                <Image
                  src="/assets/icons/plane-take-off-icon.svg"
                  alt="Icon for Flying From"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <input
  type="text"
  {...register("flyingFrom.name", {
    validate: (value) => {
      if (flightState.flyingFrom.name === "") {
        return "Select airport name from suggestions";
      }
      return true;
    },
    required: {
      value: true,
      message: "Flying from field is required",
    },
  })}
  value={flightState.flyingFrom.name} // Bind to Redux state
  onChange={(e) => handleFlyingFromChange(e)}
  className="w-full flex-grow bg-transparent pr-2 outline-none placeholder:text-[16px]"
  placeholder="Flying from"
  autoComplete="off"
/>
               
              </div>

              {/* Flying From Error Message */}
              {errors?.flyingFrom?.name && (
                <p className="mt-1 text-[0.85rem] font-semibold text-red-400">
                  {errors?.flyingFrom?.name?.message}
                </p>
              )}

              {/* Flying From City with IATA Code Suggestion */}
              {flyingFromDropDown && (
                <div
                  className={`z-100 absolute mt-1 w-full rounded-md border bg-white`}
                >
                  {filteredCities.length > 0 && (
                    <ul>
                      {filteredCities
                        .slice(0, 7)
                        .map((airport: IFilteredAirports) => (
                          <div key={airport.iata}>
                            <li
                              className="border p-4 text-[12px] font-medium text-darkBlue hover:bg-slate-50"
                              onClick={() => handleFlyingFromCityClick(airport)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                  <Image
                                    src="/assets/icons/plane-take-off-icon.svg"
                                    alt="Icon for Flying From"
                                    width={1}
                                    height={16}
                                    className="mt-1 h-[16px] w-[16px]"
                                  />
                                  <div className="ml-4">
                                    <h4 className="text-[1rem] font-semibold">
                                      {airport?.name}
                                    </h4>
                                    <p className="">
                                      {airport?.city}, {airport?.country}
                                    </p>
                                  </div>
                                </div>
                                <p className="rounded-md bg-darkBlue p-2 text-white">
                                  {airport?.iata}
                                </p>
                              </div>
                            </li>
                          </div>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div
  className="relative"
  style={{
    height: '2.5rem',
    marginLeft: '-1.55rem',
    marginRight: '-1.55rem',
    transform: 'rotate(90deg)',
    width: '2.5rem',
    zIndex: 1,
    top: '5px',
  }}
>
 <button
      type="button"
      onClick={handleSwap}
      style={{
        alignItems: 'center',
        backgroundColor: '#fff',
        border: '2px solid #05203c',
        borderRadius: '50%',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        transition: 'transform .4s',
        width: '100%',
        top: '-3px', // Your existing inline style
      }}
    >
      {/* Top Arrow */}
      <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  aria-hidden="true" 
  style={{ width: '1rem', height: '1rem' }} 
  className="SwitchButton_icon__ZTQzO"
>
  <path d="M.44 8.56a1.5 1.5 0 010-2.12l4.5-4.5a1.5 1.5 0 012.12 0l4.5 4.5a1.5 1.5 0 01-2.12 2.12L7.5 6.622V19.5a1.5 1.5 0 01-3 0V6.621l-1.94 1.94a1.5 1.5 0 01-2.12 0zm12 6.88a1.5 1.5 0 000 2.12l4.5 4.5a1.5 1.5 0 002.12 0l4.5-4.5a1.5 1.5 0 00-2.12-2.12l-1.94 1.939V4.5a1.5 1.5 0 00-3 0v12.879l-1.94-1.94a1.5 1.5 0 00-2.12 0z"></path>
</svg>

   
   
    </button>
  </div>
            {/* Destination to input field */}
            <div
              className="relative flex-grow"
              onClick={() => {
                setFlyingFromDropDown(false);
                setDestinationToDropDown(!destinationToDropDown);
              }}
            >
              <div
                className={`flex h-12 items-center gap-3 rounded border ${errors.destinationTo ? "border-red-500" : ""} py-2 pl-8`}
              >
                <Image
                  src="/assets/icons/plane-take-off-icon.svg"
                  alt="Icon for Destination To"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <input
                  type="text"
                  {...register("destinationTo.name", {
                    validate: (value) => {
                      if (flightState.destinationTo.code === "") {
                        return "Select airport name from the suggestions";
                      }
                      return true;
                    },
                    required: {
                      value: true,
                      message: "Destination field is required",
                    },
                  })}
                  value={flightState.destinationTo.name}
                  onChange={(e) => handleDestinationToChange(e)}
                  className="w-full flex-grow bg-transparent pr-2 outline-none placeholder:text-[16px]"
                  placeholder="Destination to"
                  autoComplete="off"
                />
              </div>

              {/* Destination To Error Message */}
              {errors?.destinationTo?.name && (
                <p className="mt-1 text-[0.85rem] font-semibold text-red-400">
                  {errors?.destinationTo?.name?.message}
                </p>
              )}

              {/* Destination To City with IATA Code Suggestion */}
              {destinationToDropDown && (
                <div
                  className={`absolute z-50 mt-1 w-full rounded-md border bg-white`}
                >
                  {filteredCities.length > 0 && (
                    <ul>
                      {filteredCities
                        .slice(0, 7)
                        .map((airport: IFilteredAirports) => (
                          <div key={airport.iata}>
                            <li
                              className="border p-4 text-[12px] font-medium text-darkBlue hover:bg-slate-50"
                              onClick={() =>
                                handleDestinationToCityClick(airport)
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                  <Image
                                    src="/assets/icons/plane-take-off-icon.svg"
                                    alt="Icon for Flying From"
                                    width={1}
                                    height={16}
                                    className="mt-1 h-[16px] w-[16px]"
                                  />
                                  <div className="ml-4">
                                    <h4 className="text-[1rem] font-semibold">
                                      {airport?.name}
                                    </h4>
                                    <p className="">
                                      {airport?.city}, {airport?.country}
                                    </p>
                                  </div>
                                </div>
                                <p className="rounded-md bg-darkBlue p-2 text-white">
                                  {airport?.iata}
                                </p>
                              </div>
                            </li>
                          </div>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Input Field: Desktop Departure Date */}
            {flightState.flightType !== ROUND_TRIP_FLIGHT_TYPE && (
                     <div className="relative flex flex-col space-y-4">
                     <div className="flex h-12 items-center gap-3 rounded border py-2 pl-3">
                       <input
                         type="text"
                         placeholder="Select Start Date"
                         value={startDate ? dayjs(startDate).format('MM/DD/YYYY') : ''}
                         onClick={() => setCalendarOpen(true)}
                         readOnly
                         className="w-full flex-grow bg-transparent outline-none placeholder:text-[16px] disabled:cursor-not-allowed disabled:opacity-70"
                       />
                       <Image
                         src="/assets/icons/calendar-icon.svg"
                         alt="Calendar Icon"
                         width={16}
                         height={16}
                         className="mr-2"
                       />
                     </div>
                     {calendarOpen && (
                       <div 
                         className="absolute top-12 w-full z-10" 
                         style={{ width: '350px' }} // Adjust the width as needed
                       >
                         <DatePicker
                           ref={calendarRef}
                           selected={startDate}
                           onChange={onewayDateChange}
                           inline
                           minDate={new Date()}
                           renderDayContents={(day) => (
                             <div className="text-md pb-1 font-mono font-semibold">{day}</div>
                           )}
                           popperClassName="bg-white mt-2 drop-shadow-2xl"
                           calendarContainer={({ children, className }) => (
                             <div className={className} style={{ width: '350px' }}>{children}</div> // Adjust the width as needed
                           )}
                         />
                       </div>
                     )}
                   </div>
            )}

            {/* Input Field: Desktop Return Date */}
            {flightState.flightType === ROUND_TRIP_FLIGHT_TYPE && (
  <div className="relative flex flex-col space-y-4" style={{ width: '750px' }}>
  <div className="flex h-12 items-center gap-3 rounded border py-2 pl-3">
    <input
      type="text"
      placeholder="Select Date Range"
      value={
        startDate && endDate
          ? `${dayjs(startDate).format('MM/DD/YYYY')} - ${dayjs(endDate).format('MM/DD/YYYY')}`
          : startDate
          ? `${dayjs(startDate).format('MM/DD/YYYY')} - `
          : ''
      }
      onClick={() => setCalendarOpen(true)}
      readOnly
      className="w-full flex-grow bg-transparent outline-none placeholder:text-[16px] disabled:cursor-not-allowed disabled:opacity-70"
    />
    <Image
      src="/assets/icons/calendar-icon.svg"
      alt="Calendar Icon"
      width={16}
      height={16}
      className="mr-2"
    />
  </div>
  {calendarOpen && (
    <div className="absolute top-12 w-full z-10">
      <DatePicker
        ref={calendarRef}
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        monthsShown={2}
        minDate={new Date()}
        renderDayContents={(day) => (
          <div className="text-md pb-1 font-mono font-semibold">{day}</div>
        )}
        popperClassName="bg-white mt-2 drop-shadow-2xl"
        popperPlacement="bottom-start"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '0, 10px',
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'viewport',
          },
        }}
        calendarContainer={({ children, className }) => (
          <div>
            <div className={className}>{children}</div>
          </div>
        )}
      />
      <button
        onClick={() => {
          SubmitCalender();
          // Dispatch dates as formatted strings (YYYY-MM-DD)
          dispatch(flightDepartureDate(startDate?.toISOString().split("T")[0]));
          dispatch(flightReturnDate([
            startDate?.toISOString().split("T")[0],
            endDate?.toISOString().split("T")[0]
          ]));
        }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  )}
</div>


             )}

            {/* Desktop Search Button */}
            <div className="flex h-12 w-full min-w-[110px] items-center justify-center rounded-[4px] bg-darkBlue px-4 py-2 text-[16px] font-[600] text-white sm:w-[10%]">
              <button
                type="submit"
                disabled={
                  (flightState.flyingFrom.name &&
                    flightState.destinationTo.name &&
                    (flightState.flightDepartureDate ||
                      flightState.flightReturnDate[0])) === ""
                }
                className={`flex items-center gap-[6px] disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <Image
                  src="/assets/icons/search-icon.svg"
                  alt="Icon for Search Flights"
                  width={14}
                  height={14}
                  className="h-[14px] w-[14px]"
                />
                {currentPath === "/flights/search-results"
                  ? "Update"
                  : "Search"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlightSearchFormDesktop;
