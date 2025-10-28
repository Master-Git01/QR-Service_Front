import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeaturesCardComponent } from '../../components/features-card/features-card.component';
import { NgFor } from '@angular/common';
import { FeaturesCardData } from '../../interfaces/materials-card.interface';
import { featuresCardArray } from '../../configurations/features-card.configuration';
import { PromoComponent } from '../../components/promo/promo.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FeaturesCardComponent, NgFor, PromoComponent],

  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  public readonly featuresCards: FeaturesCardData[] = featuresCardArray;
}
