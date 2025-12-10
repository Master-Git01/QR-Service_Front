import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturesCardData } from '../../interfaces/materials-card.interface';

@Component({
  selector: 'app-features-card',
  standalone: true,
  imports: [],
  templateUrl: './features-card.component.html',
  styleUrl: './features-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesCardComponent {
  @Input({ required: true }) featuresCard!: FeaturesCardData;
}
