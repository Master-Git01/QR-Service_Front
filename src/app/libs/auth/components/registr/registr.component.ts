import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './registr.component.html',
  styleUrl: './registr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  public inputField = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(\+7|8)\d{10}$/),
  ]);

  public onSubmit(): void {
    const phone = this.inputField.value;
    this.authService.signup(phone!);
  }
}
