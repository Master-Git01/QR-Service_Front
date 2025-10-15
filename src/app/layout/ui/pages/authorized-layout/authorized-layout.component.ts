import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatIconModule, MatButtonModule, RouterModule, NgIf],
  templateUrl: './authorized-layout.component.html',
  styleUrls: ['./authorized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutComponent {}

