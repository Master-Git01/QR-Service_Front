import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-qr-preview',
  standalone: true,
  imports: [NgIf],
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
