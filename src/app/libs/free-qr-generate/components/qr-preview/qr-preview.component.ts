import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-qr-preview',
  standalone: true,
  imports: [NgIf, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './qr-preview.component.html',
  styleUrls: ['./qr-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrPreviewComponent {
  @Input() qrUrl: string | null = null;
  @Input() hasQr = false;

  @Output() download = new EventEmitter<void>();

  onDownloadClick(): void {
    this.download.emit();
  }
}
