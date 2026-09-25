import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopologiaService } from '../../services/topologia-service';
import { Dispositivo } from '../../types/dispositivo';
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
    await fixture.whenStable();
  });

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
});
