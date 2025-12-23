import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade } from '../../../auth/auth.facade';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  logout(): void {
    this.authFacade.logout();
  }

  delete(): void {
    this.authFacade.deleteMe();
  }
}
