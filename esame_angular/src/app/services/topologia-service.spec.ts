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
});
