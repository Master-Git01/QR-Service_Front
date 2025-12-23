import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacade } from '../../auth.facade';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './onboard.component.html',
  styleUrl: './onboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class onboardComponent {
  private readonly authFacade = inject(AuthFacade);

  public inputField = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(\+7|8)\d{10}$/),
  ]);

  public onSubmit(): void {
    const phone = this.inputField.value;
    this.authFacade.sendPhone(phone!);
  }
}
