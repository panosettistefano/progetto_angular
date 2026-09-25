import { Component, inject } from '@angular/core';
import {
  ALTEZZA_CANVAS,
  DIMENSIONE_DISPOSITIVO,
  LARGHEZZA_CANVAS,
  SOGLIA_TRASCINAMENTO,
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

  idPremuto: number | null = null;

  partenzaX = 0;

  partenzaY = 0;

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

    elemento.setPointerCapture?.(varEvento.pointerId);

    this.idPremuto = varId;
    this.partenzaX = varEvento.clientX;
    this.partenzaY = varEvento.clientY;

    if (this.service.modalita() != "edit") {
      return;
    }

    const piano = elemento.parentElement.getBoundingClientRect();

    this.scostamentoX = varEvento.clientX - piano.left - dispositivo.x;
    this.scostamentoY = varEvento.clientY - piano.top - dispositivo.y;
  }

  trascina(varEvento: PointerEvent): void {
    const id = this.idPremuto;
    const elemento = varEvento.currentTarget as HTMLElement;

    if (id == null || !elemento.parentElement || this.service.modalita() != "edit") {
      return;
    }

    const piano = elemento.parentElement.getBoundingClientRect();
    const x = Math.round(varEvento.clientX - piano.left - this.scostamentoX);
    const y = Math.round(varEvento.clientY - piano.top - this.scostamentoY);

    this.service.spostaDispositivo(id, this.limita(x, this.larghezza), this.limita(y, this.altezza));
  }

  finisciTrascinamento(varEvento: PointerEvent): void {
    const elemento = varEvento.currentTarget as HTMLElement;
    const id = this.idPremuto;

    if (id == null) {
      return;
    }

    elemento.releasePointerCapture?.(varEvento.pointerId);

    this.idPremuto = null;

    if (this.distanza(varEvento) < SOGLIA_TRASCINAMENTO) {
      this.service.cliccaDispositivo(id);
    }
  }

  annullaTrascinamento(varEvento: PointerEvent): void {
    const elemento = varEvento.currentTarget as HTMLElement;

    elemento.releasePointerCapture?.(varEvento.pointerId);

    this.idPremuto = null;
  }

  apriDettaglio(varEvento: MouseEvent, varId: number): void {
    varEvento.preventDefault();

    this.service.apriDettaglio(varId);
  }

  private distanza(varEvento: PointerEvent): number {
    return Math.hypot(varEvento.clientX - this.partenzaX, varEvento.clientY - this.partenzaY);
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
