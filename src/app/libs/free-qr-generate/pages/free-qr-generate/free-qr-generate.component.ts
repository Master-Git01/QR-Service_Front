import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QrCardsComponent } from "../../components/qr-cards.component";

@Component({
  selector: 'app-free-qr-generate',
  standalone: true,
  imports: [QrCardsComponent],
  templateUrl: './free-qr-generate.component.html',
  styleUrl: './free-qr-generate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreeQrGenerateComponent {

}
