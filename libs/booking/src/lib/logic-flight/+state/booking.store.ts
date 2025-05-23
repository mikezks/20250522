import { computed, inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withComputed, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { FlightService } from '../data-access/flight.service';
import { Flight } from '../model/flight';
import { flightEvents } from './flight.events';


const flightConfig = entityConfig({
  entity: type<Flight>(),
  collection: 'flight'
});

export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    basket: {
      3: true,
      5: true
    } as Record<number, boolean>,
    selectedOnly: false
  }),
  withEntities(flightConfig),
  // Selector
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flightEntities().filter(
        flight => flight.delayed
      )
    ),
    route: computed(
      () => 'From ' + store.filter().from + ' to ' + store.filter().to + '.'
    ),
    selectedFlights: computed(
      () => store.flightEntities().filter(
        flight => store.basket()[flight.id]
      )
    )
  })),
  withComputed(store => ({
    flightResult: computed(() => store.selectedOnly()
      ? store.selectedFlights()
      : store.flightEntities()
    )
  })),
  withReducer(    
    on(flightEvents.selectedOnlyChanged, ({ payload: selected }) => ({
      selectedOnly: selected
    })),
    on(flightEvents.basketUpdated, ({ payload: update }) => state => ({
      basket: {
        ...state.basket,
        [update.id]: update.selected
      }
    })),
    on(flightEvents.flightFilterChanged, ({ payload: filter }) =>
      ({ filter })
    ),
    on(flightEvents.flightsChanged, ({ payload: flights }) =>
      setAllEntities(flights, flightConfig)
    ),
    on(flightEvents.flightsReset, () =>
      removeAllEntities(flightConfig)
    ),
    on(flightEvents.flightChanged, ({ payload: flight }) =>
      setEntity(flight, flightConfig)
    ),
  ),
  withEffects((
    store,
    events = inject(Events),
    flightService = inject(FlightService)
  ) => ({
    loadFlights$: events
      .on(flightEvents.flightFilterChanged)
      .pipe(
        switchMap(({ payload: filter}) => flightService.find(
        filter.from,
        filter.to,
        filter.urgent
      )),
      mapResponse({
        next: flights => flightEvents.flightsChanged(flights),
        error: err => console.error(err)
      })
    )
  }))
);