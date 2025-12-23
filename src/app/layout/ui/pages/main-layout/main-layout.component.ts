import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthFacade } from '../../../../libs/auth/auth.facade';

@Component({
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  private readonly authFacade = inject(AuthFacade);
  private router: Router = inject(Router);

  goToSignup(): void {
    this.authFacade.setOtp();

    this.router.navigate(['/onboard']);
  }
}
