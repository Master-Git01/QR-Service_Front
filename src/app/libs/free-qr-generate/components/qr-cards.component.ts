import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core'; // для mat-option
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-qr-cards',
  templateUrl: './qr-cards.component.html',
  styleUrl: './qr-cards.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    NgIf,
  ],
})
export class QrCardsComponent {
  @ViewChild('qrInput') urlQr!: ElementRef;
  @ViewChild('formatSelect') QrFormant!: MatSelect;
  formats = ['PNG', 'SVG'];
  previewUrl: string | null = null;
  thirdCardText = [
    'Для печати используйте SVG - он векторный и не теряет качество.',
    'Если планируете менять ссылку часто - используйте динамический редирект на сервере.',
    'В free-режиме статистика будет базовой; для детальной аналитики нужна регистрация и backend-хранилище.',
  ]

  onClearQr(): void {
    this.urlQr.nativeElement.value = null;
    this.QrFormant.value = null;
    this.previewUrl = null;
  }
}

