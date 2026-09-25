import { Component, inject } from '@angular/core';
import { ALTEZZA_CANVAS, DIMENSIONE_DISPOSITIVO, LARGHEZZA_CANVAS } from '../../costanti';
import { TopologiaService } from '../../services/topologia-service';
import { TipoDispositivo } from '../../types/dispositivo';

@Component({
  imports: [],
  selector: 'app-canvas',
  styleUrl: './canvas.css',
  templateUrl: './canvas.html',
})
export class Canvas {

  service = inject(TopologiaService);

  larghezza = LARGHEZZA_CANVAS;

  altezza = ALTEZZA_CANVAS;

  dimensione = DIMENSIONE_DISPOSITIVO;

  classeDispositivo(varTipo: TipoDispositivo): string {
    if (varTipo == "PC") {
      return "dispositivo-pc";
    }
    if (varTipo == "Switch") {
      return "dispositivo-switch";
    }
    return "dispositivo-router";
  }

  iconaDispositivo(varTipo: TipoDispositivo): string {
    if (varTipo == "PC") {
      return "bi-pc-display";
    }
    if (varTipo == "Switch") {
      return "bi-hdd-network";
    }
    return "bi-router";
  }

}
