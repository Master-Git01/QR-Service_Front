import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturesCardData } from '../../interfaces/materials-card.interface';
// import { CardClassesData } from '../../interfaces/card-classes.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-features-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './features-card.component.html',
  styleUrl: './features-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesCardComponent {
  @Input({ required: true }) featuresCard!: FeaturesCardData;
}
