import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGIFResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _historial: string[] = [];

  private endPoint: string = `https://api.giphy.com/v1/gifs/search`;
  private apiKey: string = 'Al8W2Y8ZV16lTPlSpAI9b5YuFHs89q1S';
  private limit: number = 20;

  public resultados: Gif[] = [];

  constructor(private http: HttpClient) {
    //Recuperamos del local storage:
    this._historial = JSON.parse(localStorage.getItem('historial')!);
    //Recuperamos del local storage para previsualizar algo al inicio:
    this.resultados = JSON.parse(localStorage.getItem('resultados')!);
  }

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();

    if (query.length === 0) return;

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      //Guardamos en el local storage:
      localStorage.setItem('historial', JSON.stringify(this.historial));
    }

    //Implementando los parámetros para la petición:
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', `${this.limit}`);

    this.http
      .get<SearchGIFResponse>(this.endPoint, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
