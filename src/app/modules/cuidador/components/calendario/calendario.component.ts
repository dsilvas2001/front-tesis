import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styles: ``,
})
export class CalendarioComponent implements OnInit {
  @ViewChild('calendarDaysMobile', { static: true })
  calendarDaysMobile!: ElementRef;
  @ViewChild('calendarDaysDesktop', { static: true })
  calendarDaysDesktop!: ElementRef;

  currentDate: Date;
  selectedDate: Date | null = null;
  isCalendarOpen: boolean = false; // Controla la visibilidad del sidebar en móviles

  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  years: number[] = this.generateYears(2000, 2030); // Rango de años

  constructor() {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );

    document
      .getElementById('prev-month-mobile')
      ?.addEventListener('click', () => this.changeMonth(-1));
    document
      .getElementById('next-month-mobile')
      ?.addEventListener('click', () => this.changeMonth(1));

    // Agregar event listeners para los botones de escritorio
    document
      .getElementById('prev-month-desktop')
      ?.addEventListener('click', () => this.changeMonth(-1));
    document
      .getElementById('next-month-desktop')
      ?.addEventListener('click', () => this.changeMonth(1));

    document
      .getElementById('reset-to-today')
      ?.addEventListener('click', () => this.resetToToday());
    document
      .getElementById('month-select')
      ?.addEventListener('change', (event) => this.changeMonthBySelect(event));
    document
      .getElementById('year-select')
      ?.addEventListener('change', (event) => this.changeYearBySelect(event));
  }

  generateYears(start: number, end: number): number[] {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  }

  changeMonth(offset: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );
  }

  changeMonthBySelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentDate.setMonth(Number(select.value));
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );
  }

  changeYearBySelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentDate.setFullYear(Number(select.value));
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );
  }

  resetToToday(): void {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );
  }

  selectDay(day: number): void {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysMobile.nativeElement
    );
    this.renderCalendar(
      this.currentDate,
      this.calendarDaysDesktop.nativeElement
    );

    // Aquí imprimimos la fecha seleccionada en formato ISO (para MongoDB)
    console.log('Fecha seleccionada:', this.selectedDate.toISOString());
  }

  toggleCalendar(): void {
    this.isCalendarOpen = !this.isCalendarOpen; // Cambia la visibilidad del sidebar en móviles
  }

  renderCalendar(date: Date, calendarDaysElement: HTMLElement): void {
    const currentMonthElement = document.getElementById('current-month');
    if (!currentMonthElement || !calendarDaysElement) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    currentMonthElement.textContent = `${this.months[month]} ${year}`;

    let daysHtml = '';

    // Rellenar los días del mes anterior
    for (let i = 0; i < startingDay; i++) {
      daysHtml += `<div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer"><span class="text-xs font-semibold text-gray-400">${new Date(
        year,
        month,
        -startingDay + i + 1
      ).getDate()}</span></div>`;
    }

    // Rellenar los días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isToday = dayDate.toDateString() === new Date().toDateString();
      const isSelected =
        this.selectedDate &&
        dayDate.toDateString() === this.selectedDate.toDateString();

      daysHtml += `
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 ${
          isSelected ? 'bg-secondary-100 border-warning-600' : 'bg-white'
        } border-r border-b border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer"
             (click)="selectDay(${i})">
          <span class="text-xs font-semibold ${
            isToday
              ? 'text-neutral-900 sm:w-6 sm:h-6 rounded-full sm:flex items-center justify-center sm:bg-accent-300 font-bold font-poppins'
              : 'text-gray-900'
          }">${i}</span>
        </div>`;
    }

    // Rellenar los días del siguiente mes
    const totalCells = 42; // 6 semanas * 7 días
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      daysHtml += `<div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer"><span class="text-xs font-semibold text-gray-400">${i}</span></div>`;
    }

    calendarDaysElement.innerHTML = daysHtml;

    // Agregar event listeners a los días del mes actual
    const dayElements = calendarDaysElement.querySelectorAll('.cursor-pointer');
    dayElements.forEach((element, index) => {
      if (index >= startingDay && index < startingDay + daysInMonth) {
        const day = index - startingDay + 1;
        element.addEventListener('click', () => this.selectDay(day));
      }
    });
  }
}
