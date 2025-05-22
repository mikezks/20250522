import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FlightFilter } from '../model/flight-filter';
import { Flight } from '../model/flight';
import { computed, inject } from '@angular/core';
import { pipe, switchMap } from 'rxjs';
import { FlightService } from '../data-access/flight.service';


const flightConfig = entityConfig({
  entity: type<Flight>(),
  collection: 'flight'
});

export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState({
    filter: {
      from: 'Graz',
      to: 'Hamburg',
      urgent: false
    },
    basket: {
      3: true,
      5: true
    } as Record<number, boolean>
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
    )
  })),
  // Updaters
  withMethods(store => ({
    setFilter: (filter: FlightFilter) =>
      patchState(store, { filter }),
    setFlights: (flights: Flight[]) =>
      patchState(
        store,
        setAllEntities(flights, flightConfig)
      ),
    setFlight: (flight: Flight) =>
      patchState(
        store,
        setEntity(flight, flightConfig)
      ),
    updateBasket: (id: number, selected: boolean) =>
      patchState(store, state => ({ basket: {
        ...state.basket,
        [id]: selected
      }})),
    resetFlights: () => patchState(
      store,
      removeAllEntities(flightConfig)
    )
  })),
  // Side-Effects
  withMethods((
    store,
    flightSerive = inject(FlightService)
  ) => ({
    loadFlights: rxMethod<FlightFilter>(pipe(
      switchMap(filter => flightSerive.find(
        filter.from,
        filter.to,
        filter.urgent
      )),
      tapResponse(
        flights => store.setFlights(flights),
        err => console.error(err)
      )
    ))
  })),
  withHooks(store => ({
    onInit: () => store.loadFlights(store.filter)
  }))
);