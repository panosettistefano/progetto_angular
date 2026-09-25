import { Component, inject } from '@angular/core';
import { TopologiaService } from '../../services/topologia-service';

@Component({
  imports: [],
  selector: 'app-strumenti',
  styleUrl: './strumenti.css',
  templateUrl: './strumenti.html',
})
export class Strumenti {

  service = inject(TopologiaService);

}
