import { Component, inject } from '@angular/core';
import { TopologiaService } from '../../services/topologia-service';
import { StatoDispositivo } from '../../types/dispositivo';

@Component({
  imports: [],
  selector: 'app-dettaglio',
  styleUrl: './dettaglio.css',
  templateUrl: './dettaglio.html',
})
export class Dettaglio {

  service = inject(TopologiaService);

  classeStato(varStato: StatoDispositivo): string {
    if (varStato == "Online") {
      return "text-bg-success";
    }
    if (varStato == "Offline") {
      return "text-bg-danger";
    }
    return "text-bg-warning";
  }

}
