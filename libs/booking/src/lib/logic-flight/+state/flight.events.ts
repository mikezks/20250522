import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { Flight } from "../model/flight";

export const flightEvents = eventGroup({
  source: 'Flight',
  events: {
    flightFilterChanged: type<{
      from: string,
      to: string,
      urgent: boolean
    }>(),
    flightsChanged: type<Flight[]>(),
    flightsReset: type<void>(),
    flightChanged: type<Flight>(),
    basketUpdated: type<{ id: number, selected: boolean }>(),
    selectedOnlyChanged: type<boolean>(),
    delayedOnlyChanged: type<boolean>(),
  }
});