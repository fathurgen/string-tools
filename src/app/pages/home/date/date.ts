import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './date.html',
  styleUrl: './date.scss'
})
export class DateTabComponent {

  selectedDate: string | null = null;

}
