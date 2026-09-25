import { Service } from '@angular/core';
import { CHIAVE_TOPOLOGIA } from '../costanti';
import { Topologia } from '../types/topologia';

@Service()
export class PersistenzaService {

    salva(varTopologia: Topologia): boolean {
        try {
            localStorage.setItem(CHIAVE_TOPOLOGIA, JSON.stringify(varTopologia))

            return true
        } catch {
            return false
        }
    }

    carica(): Topologia | null {
        try {
            const salvata = localStorage.getItem(CHIAVE_TOPOLOGIA)

            if (!salvata) {
                return null
            }

            const topologia = JSON.parse(salvata) as Topologia

            if (!topologia || typeof topologia.nome != "string"
                || !Array.isArray(topologia.dispositivi)
                || !Array.isArray(topologia.connessioni)) {
                return null
            }

            return topologia
        } catch {
            return null
        }
    }

    cancella(): boolean {
        try {
            localStorage.removeItem(CHIAVE_TOPOLOGIA)

            return true
        } catch {
            return false
        }
    }

}
