import { Component, inject } from '@angular/core';
import {
  ALTEZZA_CANVAS,
  DIMENSIONE_DISPOSITIVO,
  LARGHEZZA_CANVAS,
} from '../../costanti';
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

  idTrascinato: number | null = null;

  scostamentoX = 0;

  scostamentoY = 0;

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

  iniziaTrascinamento(varEvento: PointerEvent, varId: number): void {
    const elemento = varEvento.currentTarget as HTMLElement;
    const dispositivo = this.service.dispositivi().find(d => d.id == varId);

    if (varEvento.button != 0 || !dispositivo || !elemento.parentElement) {
      return;
    }

    const piano = elemento.parentElement.getBoundingClientRect();

    elemento.setPointerCapture?.(varEvento.pointerId);

    this.idTrascinato = varId;
    this.scostamentoX = varEvento.clientX - piano.left - dispositivo.x;
    this.scostamentoY = varEvento.clientY - piano.top - dispositivo.y;
  }

  trascina(varEvento: PointerEvent): void {
    const id = this.idTrascinato;
    const elemento = varEvento.currentTarget as HTMLElement;

    if (id == null || !elemento.parentElement) {
      return;
    }

    const piano = elemento.parentElement.getBoundingClientRect();
    const x = Math.round(varEvento.clientX - piano.left - this.scostamentoX);
    const y = Math.round(varEvento.clientY - piano.top - this.scostamentoY);

    this.service.spostaDispositivo(id, this.limita(x, this.larghezza), this.limita(y, this.altezza));
  }

  finisciTrascinamento(varEvento: PointerEvent): void {
    const elemento = varEvento.currentTarget as HTMLElement;

    if (this.idTrascinato == null) {
      return;
    }

    elemento.releasePointerCapture?.(varEvento.pointerId);

    this.idTrascinato = null;
  }

  private limita(varValore: number, varMassimo: number): number {
    const meta = this.dimensione / 2;

    if (varValore < meta) {
      return meta;
    }
    if (varValore > varMassimo - meta) {
      return varMassimo - meta;
    }
    return varValore;
  }

}
