import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthFacade } from '../../../../libs/auth/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() signup = new EventEmitter();

  private readonly authFacade = inject(AuthFacade);

  public authStatus$ = this.authFacade.authStatus$;

  goToSignup(): void {
    this.signup.emit();
  }
}
