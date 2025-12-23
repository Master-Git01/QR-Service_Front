import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FeaturesCardComponent } from '../../components/features-card/features-card.component';
import { NgFor } from '@angular/common';
import { FeaturesCardData } from '../../interfaces/materials-card.interface';
import { featuresCardArray } from '../../configurations/features-card.configuration';
import { PromoComponent } from '../../components/promo/promo.component';
import { AuthFacade } from '../../../auth/auth.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FeaturesCardComponent, NgFor, PromoComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private router: Router = inject(Router);

  public readonly featuresCards: FeaturesCardData[] = featuresCardArray;

  ngOnInit(): void {
    this.authFacade.resetAuthState();
  }

  goToSignup(): void {
    this.authFacade.setOtp();

    this.router.navigate(['/onboard']);
  }
}
