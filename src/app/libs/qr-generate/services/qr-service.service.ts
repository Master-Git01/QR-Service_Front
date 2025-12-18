import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrGenerationService {
  private http: HttpClient = inject(HttpClient);

  // private fakeQrList = [
  //   'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/1',
  //   'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/2',
  //   'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/3',
  // ];

  // private counter = 0;

  // generateOnce(url: string | undefined): Observable<string | null> {
  //   if (!url) return of(null);

  //   const qr = this.fakeQrList[this.counter % this.fakeQrList.length];
  //   this.counter++;
  //   return of(qr);
  // }

  generateOnce(url: string): Observable<string> {
    return this.http.post(`/preview`, { url }, { responseType: 'text' });
  }

  generateQr(url: string, format: string): Observable<Blob> {
    return this.http.post('/', { url, format }, { responseType: 'blob' });
  }
}
