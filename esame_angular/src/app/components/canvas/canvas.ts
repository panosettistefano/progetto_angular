import { Component, inject } from '@angular/core';
import { TopologiaService } from '../../services/topologia-service';

@Component({
  imports: [],
  selector: 'app-canvas',
  styleUrl: './canvas.css',
  templateUrl: './canvas.html',
})
export class Canvas {

  service = inject(TopologiaService);

}
