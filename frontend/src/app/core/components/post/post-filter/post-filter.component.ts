import {
  Component,
  computed,
  effect,
  EffectRef,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, skip, Subscription } from 'rxjs';

import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import {
  ToggleButtonChangeEvent,
  ToggleButtonModule,
} from 'primeng/togglebutton';

import { Sorting, SortOptions, SortOrder } from '@core/interfaces/sorting';

@Component({
  selector: 'sn-post-filter',
  imports: [FormsModule, SelectButtonModule, ToggleButtonModule],
  templateUrl: './post-filter.component.html',
  styleUrl: './post-filter.component.css',
})
export class PostFilterComponent implements OnInit, OnDestroy {
  private toggleCheckedEffectRef?: EffectRef;
  private sortOption = signal<SortOptions>('createdAt');
  private sortOrder = signal<SortOrder>('desc');
  private sorting = computed<Sorting>(() => {
    return {
      sortBy: this.sortOption(),
      sortOrder: this.sortOrder(),
    };
  });
  private sortingChange$ = toObservable(this.sorting);
  private suscription?: Subscription;
  private readonly sortingOrderOptions = signal<SortOrder[]>([
    'asc',
    'desc',
  ]).asReadonly();
  public readonly sortingChangeEvent = output<Sorting>();
  public readonly sortingOptions = signal<any[]>([
    {
      label: 'Fecha de creación',
      value: 'createdAt',
      icon: 'pi pi-calendar-clock',
    },
    {
      label: 'Cantidad de Me Gusta',
      value: 'likesCount',
      icon: 'pi pi-thumbs-up',
    },
  ]).asReadonly();
  public toggleChecked = this.sortOrder() === 'asc';

  constructor() {
    this.toggleCheckedEffectRef = effect(() => {
      this.toggleChecked = this.sortOrder() === 'asc';
    });
  }

  ngOnInit(): void {
    this.suscription = this.sortingChange$
      .pipe(skip(1), debounceTime(1000))
      .subscribe((sorting) => {
        if (sorting.sortBy && sorting.sortOrder) {
          this.sortingChangeEvent.emit(sorting);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.suscription) this.suscription.unsubscribe();
    if (this.toggleCheckedEffectRef) this.toggleCheckedEffectRef.destroy();
  }

  public changeSortingOption(selectButtonEvent: SelectButtonChangeEvent): void {
    const selectedOption = selectButtonEvent.value as SortOptions;

    if (!selectedOption) {
      console.warn('No sorting option selected');
      return;
    }

    if (
      !this.sortingOptions().some((option) => option.value === selectedOption)
    ) {
      console.warn(`Invalid sorting option selected: ${selectedOption}`);
      return;
    }

    if (this.sortOption() === selectedOption) {
      console.warn(`Sorting option is already set to: ${selectedOption}`);
      return;
    }

    this.sortOption.set(selectedOption);
  }

  public changeSortingOrder(): void {
    const selectedOrder: SortOrder = this.toggleChecked ? 'asc' : 'desc';

    if (!selectedOrder) {
      console.warn('No sorting order selected');
      return;
    }

    if (
      !this.sortingOrderOptions().some((option) => option === selectedOrder)
    ) {
      console.warn(`Invalid sorting order selected: ${selectedOrder}`);
      return;
    }

    if (this.sortOrder() === selectedOrder) {
      console.warn(`Sorting order is already set to: ${selectedOrder}`);
      return;
    }

    this.sortOrder.set(selectedOrder);
  }
}
