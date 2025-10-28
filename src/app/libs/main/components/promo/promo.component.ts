import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoComponent {
  private router: Router = inject(Router);

  onGenerateFree(): void {
    this.router.navigate(['/generate']);
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
