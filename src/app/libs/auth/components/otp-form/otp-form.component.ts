import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpFormComponent {
  @Output() submitCode = new EventEmitter<string>();
  @Output() changePhone = new EventEmitter<void>();
  @Output() resendOtp = new EventEmitter<void>();

  @Input() phoneNumber!: string | null | undefined;

  readonly inputField = new FormControl('', [Validators.required, Validators.pattern(/^\d{1,8}$/)]);

  onSubmit(): void {
    this.submitCode.emit(this.inputField.value!);
  }

  onChangePhone(): void {
    this.changePhone.emit();
  }

  onResendOtp(): void {
    this.resendOtp.emit();
  }
}
