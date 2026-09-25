import { Component } from '@angular/core';
import { Canvas } from './components/canvas/canvas';
import { Dettaglio } from './components/dettaglio/dettaglio';
import { Strumenti } from './components/strumenti/strumenti';

@Component({
  imports: [Strumenti, Canvas, Dettaglio],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
