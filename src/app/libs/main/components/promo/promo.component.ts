import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MainPath } from '../../../../core/enums/main-path.enum';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoComponent {
  

}
