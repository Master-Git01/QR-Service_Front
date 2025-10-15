import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  standalone: true,
  imports: [RouterModule, MatButtonModule, HeaderComponent, FooterComponent],
  templateUrl: './unauthorized-layout.component.html',
  styleUrls: ['./unauthorized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedLayoutComponent {}

