import { NgClass, NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export enum QrFormat {
  PNG = 'PNG',
  SVG = 'SVG',
}

@Component({
  selector: 'app-fast-qr-generation',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgClass],
  templateUrl: './fast-qr-generation.component.html',
  styleUrl: './fast-qr-generation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FastQrGenerationComponent implements OnInit {
  @Output() generate = new EventEmitter<{ link: string; format: string }>();
  @Output() clear = new EventEmitter<void>();
  @Output() urlChange = new EventEmitter<string>();

  private readonly destroyRef = inject(DestroyRef);

  public formats = Object.values(QrFormat);

  public linkControl = new FormControl<string>('');
  public formatControl = new FormControl<string>(this.formats[0]);

  ngOnInit(): void {
    this.linkControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (!value || value.trim() === '') {
        this.urlChange.emit(undefined);
      } else {
        this.urlChange.emit(value ?? undefined);
      }
    });
  }

  onGenerateClick(): void {
    this.generate.emit({
      link: this.linkControl.value ?? '',
      format: this.formatControl.value ?? this.formats[0],
    });
  }

  onClearClick(): void {
    this.linkControl.setValue('');
    this.formatControl.setValue(this.formats[0]);
    this.clear.emit();
  }
}
