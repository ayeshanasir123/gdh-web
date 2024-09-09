import React from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

import {
  location,
  pickUpDate,
  pickUpTime,
  dropOffDate,
  dropOffTime,
} from "@/redux/features/cars/car-search-form-slice";

const CarsSearchFormDesktop = () => {
  const carSearchFormState = useAppSelector(
    (state: RootState) => state.carSearchForm,
  );

  const dispatch = useAppDispatch();

  const today = new Date();

  return (
    <section className="rounded-[10px] bg-white p-8">
      <form id="cars-search-form-desktop">
        {/* Car Search Form Input Fields */}
        <div id="cars-search-form-inputs-desktop" className="relative mt-8">
          <div className="flex gap-3">
            {/* Select Location Input Field */}
            <div className="flex-grow" onClick={() => {}}>
              <div
                className={`flex h-12 items-center gap-3 rounded border py-2 pl-3`}
              >
                <div className="flex items-center">
                  <Image
                    src="/assets/icons/location-icon.svg"
                    alt="Calendar Icon"
                    width={16}
                    height={16}
                    className="h-[16px] w-[16px]"
                  />

                  <input
                    type="text"
                    value={carSearchFormState.location.name}
                    onChange={(e) => {
                      dispatch(location({ name: e.target.value, code: "" }));
                    }}
                    className="ml-2 w-full flex-grow bg-transparent pr-2 outline-none placeholder:text-[14px]"
                    placeholder="Select Location"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            </div>

            {/* PickUp Date Input Field */}
            <div className="relative flex-grow" onClick={() => {}}>
              <div
                className={`flex h-12 items-center gap-3 rounded border py-2 pl-3`}
              >
                <Image
                  src="/assets/icons/calendar-icon.svg"
                  alt="Clock Icon"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <DatePicker
                  selected={carSearchFormState.pickUpDate}
                  onChange={(date) => {
                    dispatch(pickUpDate(date));
                  }}
                  dateFormat="yyyy/MM/dd"
                  minDate={today}
                  placeholderText="PickUp Date"
                  className="w-full flex-grow bg-transparent pr-2 outline-none placeholder:text-[14px]"
                  required={true}
                />
              </div>
            </div>

            {/* PickUp Time Input Field */}
            <div className="flex-grow">
              <div className="flex h-12 items-center gap-3 rounded border py-2 pl-3">
                <Image
                  src="/assets/icons/clock-icon.svg"
                  alt="Calendar Icon"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <DatePicker
                  selected={carSearchFormState.pickUpTime}
                  onChange={(time) => {
                    console.log("Pick Up Time: ", time);
                    dispatch(pickUpTime(time));
                  }}
                  placeholderText="PickUp Time"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full flex-grow bg-transparent pr-2 outline-none
                placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* DropOff Date Input Field */}
            <div className="flex-grow">
              <div className="flex h-12 items-center gap-3 rounded border py-2 pl-3">
                <Image
                  src="/assets/icons/calendar-icon.svg"
                  alt="Calendar Icon"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <DatePicker
                  selected={carSearchFormState.dropOffDate}
                  onChange={(date) => {
                    dispatch(dropOffDate(date));
                  }}
                  dateFormat="yyyy/MM/dd"
                  minDate={today}
                  placeholderText="DropOff Date"
                  className="w-full flex-grow bg-transparent pr-2 outline-none placeholder:text-[14px]"
                  required={true}
                />
              </div>
            </div>

            {/* DropOff Time Input Field */}
            <div className="flex-grow">
              <div className="flex h-12 items-center gap-3 rounded border py-2 pl-3">
                <Image
                  src="/assets/icons/clock-icon.svg"
                  alt="Calendar Icon"
                  width={16}
                  height={16}
                  className="h-[16px] w-[16px]"
                />
                <DatePicker
                  selected={carSearchFormState.dropOffTime}
                  onChange={(date) => dispatch(dropOffTime(date))}
                  placeholderText="DropOff Time"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full flex-grow bg-transparent pr-2 outline-none
                placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* Desktop Search Button */}
            <div className="flex h-12 w-full min-w-[110px] items-center justify-center rounded-[4px] bg-darkBlue px-4 py-2 text-[16px] font-[600] text-white sm:w-[10%]">
              <button className={`flex items-center gap-[6px]`}>
                <Image
                  src="/assets/icons/search-icon.svg"
                  alt="Icon for Search Flights"
                  width={14}
                  height={14}
                  className="h-[14px] w-[14px]"
                />
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CarsSearchFormDesktop;
