import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopologiaService } from '../../services/topologia-service';
import { Dispositivo, TipoDispositivo } from '../../types/dispositivo';
import { Canvas } from './canvas';

describe('Canvas', () => {
  let component: Canvas;
  let fixture: ComponentFixture<Canvas>;
  let service: TopologiaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canvas],
    }).compileComponents();

    fixture = TestBed.createComponent(Canvas);
    component = fixture.componentInstance;
    service = TestBed.inject(TopologiaService);
    popola();
    await fixture.whenStable();
  });

  function creaDispositivo(varId: number, varTipo: TipoDispositivo, varNome: string, varX: number, varY: number): Dispositivo {
    return {
      id: varId,
      tipo: varTipo,
      nome: varNome,
      x: varX,
      y: varY,
      ip: "192.168.1." + varId,
      hostname: varNome.toLowerCase(),
      stato: "Online"
    };
  }

  function popola(): void {
    service.dispositivi.set([
      creaDispositivo(1, "Router", "Router-01", 600, 120),
      creaDispositivo(2, "Switch", "Switch-01", 600, 340),
      creaDispositivo(3, "PC", "PC-01", 360, 560),
      creaDispositivo(4, "PC", "PC-02", 840, 560)
    ]);

    service.connessioni.set([
      { id: 1, sourceId: 1, targetId: 2 },
      { id: 2, sourceId: 2, targetId: 3 },
      { id: 3, sourceId: 2, targetId: 4 }
    ]);
  }

  function nodo(varNome: string): HTMLElement {
    const nodi = fixture.nativeElement.querySelectorAll('.dispositivo') as NodeListOf<HTMLElement>;

    return Array.from(nodi).find(n => n.textContent?.includes(varNome)) as HTMLElement;
  }

  function dispositivo(varId: number): Dispositivo {
    return service.dispositivi().find(d => d.id == varId) as Dispositivo;
  }

  function evento(varTipo: string, varX: number, varY: number): PointerEvent {
    return new PointerEvent(varTipo, {
      clientX: varX,
      clientY: varY,
      button: 0,
      bubbles: true,
    });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw the devices of the topology', () => {
    expect(fixture.nativeElement.querySelectorAll('.dispositivo').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.linee line').length).toBe(3);
  });

  it('should show the hint when the canvas is empty', async () => {
    service.dispositivi.set([]);
    service.connessioni.set([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.dispositivo').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.messaggio-vuoto')).toBeTruthy();
  });

  it('should move the device following the pointer', async () => {
    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointermove", 500, 220));
    router.dispatchEvent(evento("pointerup", 500, 220));
    await fixture.whenStable();

    expect(dispositivo(1).x).toBe(500);
    expect(dispositivo(1).y).toBe(220);
  });

  it('should keep the device inside the canvas', async () => {
    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointermove", -200, -200));
    router.dispatchEvent(evento("pointerup", -200, -200));
    await fixture.whenStable();

    expect(dispositivo(1).x).toBe(component.dimensione / 2);
    expect(dispositivo(1).y).toBe(component.dimensione / 2);
  });

  it('should update the lines of the moved device', async () => {
    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointermove", 500, 220));
    router.dispatchEvent(evento("pointerup", 500, 220));
    await fixture.whenStable();

    const linea = service.linee().find(l => l.id == 1) as { x1: number, y1: number };

    expect(linea.x1).toBe(500);
    expect(linea.y1).toBe(220);
  });

  it('should not move anything when the pointer goes down on the background', async () => {
    const piano = fixture.nativeElement.querySelector('.piano') as HTMLElement;

    piano.dispatchEvent(evento("pointerdown", 600, 120));
    piano.dispatchEvent(evento("pointermove", 400, 400));
    piano.dispatchEvent(evento("pointerup", 400, 400));
    await fixture.whenStable();

    expect(dispositivo(1).x).toBe(600);
    expect(dispositivo(3).x).toBe(360);
  });

  it('should ignore the right button', async () => {
    const router = nodo("Router-01");

    router.dispatchEvent(new PointerEvent("pointerdown", { clientX: 600, clientY: 120, button: 2, bubbles: true }));
    router.dispatchEvent(evento("pointermove", 400, 400));
    router.dispatchEvent(evento("pointerup", 400, 400));
    await fixture.whenStable();

    expect(dispositivo(1).x).toBe(600);
    expect(dispositivo(1).y).toBe(120);
  });

  it('should not move the device in connect mode', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointermove", 400, 400));
    router.dispatchEvent(evento("pointerup", 400, 400));
    await fixture.whenStable();

    expect(dispositivo(1).x).toBe(600);
    expect(dispositivo(1).y).toBe(120);
  });

  it('should select the device clicked in connect mode', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointerup", 600, 120));
    await fixture.whenStable();

    expect(service.selezionato()).toBe(1);
    expect(router.classList.contains("selezionato")).toBe(true);
  });

  it('should create the connection with two clicks in connect mode', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");
    const pc = nodo("PC-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointerup", 600, 120));
    pc.dispatchEvent(evento("pointerdown", 360, 560));
    pc.dispatchEvent(evento("pointerup", 360, 560));
    await fixture.whenStable();

    expect(service.connessioni().length).toBe(4);
    expect(service.linee().length).toBe(4);
    expect(service.selezionato()).toBeNull();
  });

  it('should not select the device when the pointer has dragged', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointermove", 500, 220));
    router.dispatchEvent(evento("pointerup", 500, 220));
    await fixture.whenStable();

    expect(service.selezionato()).toBeNull();
  });

  it('should not select the device when the drag is cancelled', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointercancel", 600, 120));
    await fixture.whenStable();

    expect(service.selezionato()).toBeNull();
  });

  it('should not select the device on a clean click in edit mode', async () => {
    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointerup", 600, 120));
    await fixture.whenStable();

    expect(service.selezionato()).toBeNull();
  });

  it('should remove the highlight when the mode changes', async () => {
    service.cambiaModalita("connect");

    const router = nodo("Router-01");

    router.dispatchEvent(evento("pointerdown", 600, 120));
    router.dispatchEvent(evento("pointerup", 600, 120));
    await fixture.whenStable();

    service.cambiaModalita("edit");
    await fixture.whenStable();

    expect(service.selezionato()).toBeNull();
    expect(router.classList.contains("selezionato")).toBe(false);
    expect(router.classList.contains("dispositivo")).toBe(true);
  });

  it('should open the detail on right click', async () => {
    const router = nodo("Router-01");
    const evento = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });

    router.dispatchEvent(evento);
    await fixture.whenStable();

    expect(service.idDettaglio()).toBe(1);
    expect(evento.defaultPrevented).toBe(true);
  });

  it('should not open the detail on right click on the background', async () => {
    const piano = fixture.nativeElement.querySelector('.piano') as HTMLElement;

    piano.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(service.idDettaglio()).toBeNull();
  });
});
