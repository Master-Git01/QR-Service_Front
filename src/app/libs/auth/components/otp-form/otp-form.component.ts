import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpFormComponent {
  @Input() phoneNumber!: string | null;

  private authService = inject(AuthService);

  public inputField = new FormControl('', [Validators.required, Validators.pattern(/^\d{1,8}$/)]);

  onSubmit(): void {
    this.authService.verify(+this.inputField.value!);
  }

  onChangePhone(): void {
    this.authService.resetOtpState();
  }

  onResendNumber(): void {
    this.authService.sendCode();
  }
}
