import { Component, inject } from '@angular/core';
import { Canvas } from './components/canvas/canvas';
import { Dettaglio } from './components/dettaglio/dettaglio';
import { Strumenti } from './components/strumenti/strumenti';
import { TopologiaService } from './services/topologia-service';

@Component({
  imports: [Strumenti, Canvas, Dettaglio],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  service = inject(TopologiaService);

}
