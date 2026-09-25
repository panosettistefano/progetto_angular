import { Service, computed, signal } from '@angular/core';
import { Connessione } from '../types/connessione';
import { Dispositivo } from '../types/dispositivo';
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

}
