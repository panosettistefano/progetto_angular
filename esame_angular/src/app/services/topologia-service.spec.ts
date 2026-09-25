import { TestBed } from '@angular/core/testing';
import { TopologiaService } from './topologia-service';

describe('TopologiaService', () => {
  let service: TopologiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopologiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with the example topology', () => {
    expect(service.dispositivi().length).toBe(4);
    expect(service.connessioni().length).toBe(3);
  });

  it('should build one line for each connection', () => {
    const linee = service.linee();

    expect(linee.length).toBe(3);
    expect(linee[0]).toEqual({ id: 1, x1: 600, y1: 120, x2: 600, y2: 340 });
  });

  it('should not build a line when a device is missing', () => {
    service.dispositivi.set(service.dispositivi().filter(d => d.id != 2));

    expect(service.linee().length).toBe(0);
  });

  it('should move a device creating a new object', () => {
    const prima = service.dispositivi()[0];

    service.spostaDispositivo(1, 100, 200);

    const dopo = service.dispositivi()[0];

    expect(dopo.x).toBe(100);
    expect(dopo.y).toBe(200);
    expect(dopo).not.toBe(prima);
    expect(prima.x).toBe(600);
  });

  it('should not touch the list when the position does not change', () => {
    const prima = service.dispositivi();

    service.spostaDispositivo(1, 600, 120);

    expect(service.dispositivi()).toBe(prima);
  });

  it('should update the lines when a device moves', () => {
    service.spostaDispositivo(1, 300, 100);

    const linea = service.linee().find(l => l.id == 1);

    expect(linea?.x1).toBe(300);
    expect(linea?.y1).toBe(100);
  });

  it('should add a device with a new id and a progressive name', () => {
    service.aggiungiDispositivo("PC");

    const nuovo = service.dispositivi()[4];

    expect(service.dispositivi().length).toBe(5);
    expect(nuovo.id).toBe(5);
    expect(nuovo.nome).toBe("PC-03");
    expect(nuovo.hostname).toBe("pc-03");
    expect(nuovo.stato).toBe("Online");
  });

  it('should keep ids unique after a device is removed', () => {
    service.dispositivi.set(service.dispositivi().filter(d => d.id != 4));

    service.aggiungiDispositivo("PC");

    const id = service.dispositivi().map(d => d.id);

    expect(id).toEqual([1, 2, 3, 4]);
  });

  it('should not overlap the new device with the existing ones', () => {
    service.aggiungiDispositivo("Switch");

    const nuovo = service.dispositivi()[4];
    const sovrapposti = service.dispositivi()
      .filter(d => d.id != nuovo.id)
      .filter(d => Math.abs(d.x - nuovo.x) < 72 && Math.abs(d.y - nuovo.y) < 72);

    expect(sovrapposti.length).toBe(0);
  });
});
