import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoComponent {}
