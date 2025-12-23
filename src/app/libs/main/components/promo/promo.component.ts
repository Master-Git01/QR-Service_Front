import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoComponent {
  @Output() signup = new EventEmitter();

  goToSignup(): void {
    this.signup.emit();
  }
}
