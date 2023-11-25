import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CalendarEvent, ScheduleItem, Trip, TripItem } from "@/types/trip";
import {
  addScheduleItem,
  addTripItem,
  createTrip,
  getAllScheduleItems,
  getAllTrips,
  getDirection,
  removeScheduleItem,
} from "./tripThunk";

export interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  scheduleItems: ScheduleItem[];
  calendarEvents: CalendarEvent[];
  sortedTripEvents: CalendarEvent[];
  tripDirections: google.maps.DirectionsResult[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState: TripState = {
  trips: [],
  currentTrip: null,
  scheduleItems: [],
  calendarEvents: [],
  sortedTripEvents: [],
  tripDirections: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setCurrentTrip: (state, action: PayloadAction<Trip>) => {
      state.currentTrip = action.payload;
    },
    editCalendarEvent: (
      state,
      action: PayloadAction<{ id: string; start: string; end: string }>,
    ) => {
      const calendarEvents = state.calendarEvents.map((event) => {
        if (event.id === action.payload.id) {
          return {
            ...event,
            start: action.payload.start,
            end: action.payload.end,
          };
        }
        return event;
      });
      state.calendarEvents = calendarEvents;
    },
    removeCalendarEvent: (state, action: PayloadAction<string>) => {
      state.calendarEvents = state.calendarEvents.filter(
        (event) => event.id !== action.payload,
      );
    },
    sortTripEvents: (state) => {
      state.sortedTripEvents = state.calendarEvents.sort((a, b) => {
        return (new Date(a.start) as any) - (new Date(b.start) as any);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.trips = [...state.trips, action.payload];
        state.currentTrip = action.payload;
        state.isLoading = false;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(getAllTrips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllTrips.fulfilled,
        (state, action: PayloadAction<Trip[]>) => {
          state.trips = action.payload;
          state.trips = state.trips.sort((a, b) => {
            return (
              (new Date(a.startDate) as any) - (new Date(b.startDate) as any)
            );
          });
          state.isLoading = false;
        },
      )
      .addCase(getAllTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(getAllScheduleItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllScheduleItems.fulfilled,
        (state, action: PayloadAction<ScheduleItem[]>) => {
          state.scheduleItems = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(getAllScheduleItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(addScheduleItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addScheduleItem.fulfilled,
        (state, action: PayloadAction<ScheduleItem>) => {
          state.scheduleItems = [...state.scheduleItems, action.payload];
          state.isLoading = false;
        },
      )
      .addCase(addScheduleItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(removeScheduleItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        removeScheduleItem.fulfilled,
        (state, action: PayloadAction<ScheduleItem>) => {
          state.scheduleItems = state.scheduleItems.filter(
            (scheduleItem) => action.payload.id !== scheduleItem.id,
          );
          state.isLoading = false;
        },
      )
      .addCase(removeScheduleItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(addTripItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addTripItem.fulfilled,
        (state, action: PayloadAction<TripItem>) => {
          const newEvent = {
            id: action.payload.id.toString(),
            title: action.payload.attraction.name,
            description: action.payload.attraction.description,
            image: action.payload.attraction.image,
            start: action.payload.start,
            end: action.payload.end,
            latitude: action.payload.attraction.latitude,
            longitude: action.payload.attraction.longitude,
            overlap: false,
          };
          state.calendarEvents = [...state.calendarEvents, newEvent];
          state.isLoading = false;
        },
      )
      .addCase(addTripItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(getDirection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDirection.fulfilled,
        (state, action: PayloadAction<google.maps.DirectionsResult>) => {
          state.tripDirections = [...state.tripDirections, action.payload];
          state.isLoading = false;
        },
      )
      .addCase(getDirection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });
  },
});

export const {
  setCurrentTrip,
  editCalendarEvent,
  removeCalendarEvent,
  sortTripEvents,
} = tripSlice.actions;

export default tripSlice.reducer;
