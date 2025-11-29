import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { QrGenerationService } from '../../services/qr-service.service';
import { FastQrGenerationComponent } from '../../components/fast-qr-generation/fast-qr-generation.component';
import { QrPreviewComponent } from '../../components/qr-preview/qr-preview.component';
import { HintsComponent } from '../../components/hints/hints.component';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-free-qr-generate',
  standalone: true,
  templateUrl: './free-qr-generate.component.html',
  styleUrl: './free-qr-generate.component.scss',
  imports: [FastQrGenerationComponent, QrPreviewComponent, HintsComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeQrGenerateComponent implements OnDestroy, OnInit {
  private qrService: QrGenerationService = inject(QrGenerationService);

  private readonly url$ = new BehaviorSubject<string>('');

  private readonly qrDataUrl$ = new BehaviorSubject<string | null>('');
  readonly qrDataUrl$$ = this.qrDataUrl$.asObservable();

  private readonly blob$ = new BehaviorSubject<Blob | null>(null);
  readonly blob$$ = this.qrDataUrl$.asObservable();

  private readonly downloadButton$ = new BehaviorSubject<boolean | null>(null);
  readonly downloadButton$$ = this.downloadButton$.asObservable();

  onUrlChange(url: string): void {
    this.url$.next(url);
  }

  ngOnInit(): void {
    this.url$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.downloadButton$.next(false)),

        switchMap((url) => {
          if (!url || url.trim() === '') {
            return of(null);
          }

          return this.qrService.generateOnce(url).pipe(
            catchError((err) => {
              console.error('Ошибка при динамической генерации:', err);
              return of(null);
            }),
          );
        }),
      )
      .subscribe((dataUrl) => this.qrDataUrl$.next(dataUrl));
  }

  generateQr(data: { link: string; format: string }): void {
    this.qrService
      .generateQr(data.link, data.format)
      .pipe(
        tap((blob) => {
          this.blob$.next(blob);

          const current = this.qrDataUrl$.value;
          if (current) URL.revokeObjectURL(current);

          const objectUrl = URL.createObjectURL(blob);
          this.qrDataUrl$.next(objectUrl);

          this.downloadButton$.next(true);
        }),

        catchError((err) => {
          console.error('Ошибка генерации', err);

          this.downloadButton$.next(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  clearAll(): void {
    this.blob$.next(null);

    if (this.qrDataUrl$.value) {
      URL.revokeObjectURL(this.qrDataUrl$.value);
      this.qrDataUrl$.next(null);
    }
  }

  ngOnDestroy(): void {
    if (this.qrDataUrl$.value) {
      URL.revokeObjectURL(this.qrDataUrl$.value);
    }
  }

  download(): void {
    if (!this.blob$.value) return;

    const a = document.createElement('a');
    a.href = this.qrDataUrl$.value!;
    a.download = 'qr-code.png';
    a.click();
  }
}
