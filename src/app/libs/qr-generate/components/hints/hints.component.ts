import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hints',
  standalone: true,
  imports: [NgFor],
  templateUrl: './hints.component.html',
  styleUrl: './hints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintsComponent {
  hintsText = [
    'Для печати используйте SVG - он векторный и не теряет качество.',
    'Если планируете менять ссылку часто - используйте динамический редирект на сервере.',
    'Для детальной аналитики нужна регистрация и подписка.',
  ];
}
