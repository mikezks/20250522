import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../api-boarding';
import { Flight } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';
import { BookingStore } from '../../logic-flight/+state/booking.store';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  protected store = inject(BookingStore);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected delay(flight: Flight): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected updateBasket(id: number, selected: boolean): void {}

  protected reset(): void {
    this.store.setFlights([]);
  }
}
