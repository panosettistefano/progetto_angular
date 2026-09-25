import { Service, computed, signal } from '@angular/core';
import { ALTEZZA_CANVAS, LARGHEZZA_CANVAS } from '../costanti';
import { Connessione } from '../types/connessione';
import { Dispositivo, TipoDispositivo } from '../types/dispositivo';
import { Linea } from '../types/linea';

@Service()
export class TopologiaService {

    nome = signal("Rete laboratorio")

    dispositivi = signal<Dispositivo[]>([
        {
            id: 1,
            tipo: "Router",
            nome: "Router-01",
            x: 600,
            y: 120,
            ip: "192.168.1.1",
            hostname: "router-main",
            stato: "Online"
        },
        {
            id: 2,
            tipo: "Switch",
            nome: "Switch-01",
            x: 600,
            y: 340,
            ip: "192.168.1.2",
            hostname: "switch-01",
            stato: "Online"
        },
        {
            id: 3,
            tipo: "PC",
            nome: "PC-01",
            x: 360,
            y: 560,
            ip: "192.168.1.10",
            hostname: "pc-01",
            stato: "Online"
        },
        {
            id: 4,
            tipo: "PC",
            nome: "PC-02",
            x: 840,
            y: 560,
            ip: "192.168.1.11",
            hostname: "pc-02",
            stato: "Offline"
        }
    ])

    connessioni = signal<Connessione[]>([
        {
            id: 1,
            sourceId: 1,
            targetId: 2
        },
        {
            id: 2,
            sourceId: 2,
            targetId: 3
        },
        {
            id: 3,
            sourceId: 2,
            targetId: 4
        }
    ])

    modalita = signal<"edit" | "connect">("edit")

    selezionato = signal<number | null>(null)

    idDettaglio = signal<number | null>(null)

    linee = computed(() => this.connessioni()
        .map(connessione => this.creaLinea(connessione))
        .filter((linea): linea is Linea => linea != null))

    creaLinea(varConnessione: Connessione): Linea | null {
        const sorgente = this.dispositivi().find(d => d.id == varConnessione.sourceId)
        const destinazione = this.dispositivi().find(d => d.id == varConnessione.targetId)

        if(!sorgente || !destinazione){
            return null
        }

        return {
            id: varConnessione.id,
            x1: sorgente.x,
            y1: sorgente.y,
            x2: destinazione.x,
            y2: destinazione.y
        }
    }

    spostaDispositivo(varId: number, varX: number, varY: number): void {
        const dispositivo = this.dispositivi().find(d => d.id == varId)

        if(!dispositivo || (dispositivo.x == varX && dispositivo.y == varY)){
            return
        }

        this.dispositivi.update(lista => lista.map(d => d.id == varId
            ? { ...d, x: varX, y: varY }
            : d))
    }

    aggiungiDispositivo(varTipo: TipoDispositivo): void {
        const id = this.prossimoId(this.dispositivi().map(d => d.id))
        const numero = this.prossimoNumero(varTipo)
        const posizione = this.posizioneLibera()

        this.dispositivi.update(lista => [
            ...lista,
            {
                id: id,
                tipo: varTipo,
                nome: varTipo + "-" + this.dueCifre(numero),
                x: posizione.x,
                y: posizione.y,
                ip: "192.168.1." + (100 + id),
                hostname: varTipo.toLowerCase() + "-" + this.dueCifre(numero),
                stato: "Online"
            }
        ])
    }

    cambiaModalita(varModalita: "edit" | "connect"): void {
        if (this.modalita() == varModalita) {
            return
        }

        this.modalita.set(varModalita)
        this.selezionato.set(null)
    }

    cliccaDispositivo(varId: number): void {
        if (this.modalita() != "connect") {
            return
        }

        const sorgente = this.selezionato()

        if (sorgente == null) {
            this.selezionato.set(varId)
            return
        }

        if (sorgente == varId) {
            this.selezionato.set(null)
            return
        }

        this.creaConnessione(sorgente, varId)
        this.selezionato.set(null)
    }

    creaConnessione(varSorgente: number, varDestinazione: number): void {
        if (varSorgente == varDestinazione) {
            alert("Un dispositivo non può essere collegato a sé stesso.")
            return
        }

        if (this.collegati(varSorgente, varDestinazione)) {
            alert("Questi due dispositivi sono già collegati.")
            return
        }

        const id = this.prossimoId(this.connessioni().map(c => c.id))

        this.connessioni.update(lista => [
            ...lista,
            {
                id: id,
                sourceId: varSorgente,
                targetId: varDestinazione
            }
        ])
    }

    private collegati(varSorgente: number, varDestinazione: number): boolean {
        return this.connessioni().some(c =>
            (c.sourceId == varSorgente && c.targetId == varDestinazione)
            || (c.sourceId == varDestinazione && c.targetId == varSorgente))
    }

    private prossimoId(varIds: number[]): number {
        return Math.max(0, ...varIds) + 1
    }

    private prossimoNumero(varTipo: TipoDispositivo): number {
        const numeri = this.dispositivi()
            .filter(d => d.tipo == varTipo)
            .map(d => parseInt(d.nome.replace(varTipo + "-", "")))
            .filter(n => !isNaN(n))

        return Math.max(0, ...numeri) + 1
    }

    private posizioneLibera(): { x: number, y: number } {
        const passo = 100
        let x = passo
        let y = passo

        while (y < ALTEZZA_CANVAS - passo && this.dispositivi()
            .some(d => Math.abs(d.x - x) < passo && Math.abs(d.y - y) < passo)) {
            x = x + passo

            if (x > LARGHEZZA_CANVAS - passo) {
                x = passo
                y = y + passo
            }
        }

        return { x: x, y: y }
    }

    private dueCifre(varNumero: number): string {
        return varNumero.toString().padStart(2, "0")
    }

}
