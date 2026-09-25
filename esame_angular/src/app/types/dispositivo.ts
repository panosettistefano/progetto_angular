export type TipoDispositivo = "PC" | "Switch" | "Router"

export type StatoDispositivo = "Online" | "Offline" | "Manutenzione"

export type Dispositivo = {
    id: number,
    tipo: TipoDispositivo,
    nome: string,
    x: number,
    y: number,
    ip: string,
    hostname: string,
    stato: StatoDispositivo
}
