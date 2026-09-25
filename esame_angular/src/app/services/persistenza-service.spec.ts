import { TestBed } from '@angular/core/testing';
import { CHIAVE_TOPOLOGIA } from '../costanti';
import { Topologia } from '../types/topologia';
import { PersistenzaService } from './persistenza-service';

describe('PersistenzaService', () => {
  let service: PersistenzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistenzaService);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function topologia(): Topologia {
    return {
      nome: "Rete laboratorio",
      versione: 1,
      dispositivi: [
        {
          id: 1,
          tipo: "Router",
          nome: "Router-01",
          x: 600,
          y: 120,
          ip: "192.168.1.101",
          hostname: "router-01",
          stato: "Offline"
        }
      ],
      connessioni: [{ id: 1, sourceId: 1, targetId: 2 }]
    };
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have nothing to load at the start', () => {
    expect(service.carica()).toBeNull();
  });

  it('should save and load the same topology', () => {
    expect(service.salva(topologia())).toBe(true);
    expect(service.carica()).toEqual(topologia());
  });

  it('should write the topology as JSON under the agreed key', () => {
    service.salva(topologia());

    const salvata = localStorage.getItem(CHIAVE_TOPOLOGIA);

    expect(salvata).toContain("Router-01");
    expect(JSON.parse(salvata as string).connessioni.length).toBe(1);
  });

  it('should overwrite the topology saved before', () => {
    service.salva(topologia());

    const vuota = topologia();

    vuota.dispositivi = [];
    service.salva(vuota);

    expect(service.carica()?.dispositivi.length).toBe(0);
  });

  it('should load nothing when the saved JSON is broken', () => {
    localStorage.setItem(CHIAVE_TOPOLOGIA, "{questo non è json");

    expect(service.carica()).toBeNull();
  });

  it('should load nothing when the saved data is not a topology', () => {
    localStorage.setItem(CHIAVE_TOPOLOGIA, JSON.stringify({ qualcosa: true }));

    expect(service.carica()).toBeNull();
  });

  it('should delete the saved topology', () => {
    service.salva(topologia());

    expect(service.cancella()).toBe(true);
    expect(service.carica()).toBeNull();
    expect(localStorage.getItem(CHIAVE_TOPOLOGIA)).toBeNull();
  });

  it('should not break when the storage refuses to write', () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(service.salva(topologia())).toBe(false);
  });

  it('should not break when the storage refuses to read', () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(service.carica()).toBeNull();
  });
});
