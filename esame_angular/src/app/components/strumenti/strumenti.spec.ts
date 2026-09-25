import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CHIAVE_TOPOLOGIA } from '../../costanti';
import { Strumenti } from './strumenti';

describe('Strumenti', () => {
  let component: Strumenti;
  let fixture: ComponentFixture<Strumenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Strumenti],
    }).compileComponents();

    fixture = TestBed.createComponent(Strumenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function pulsante(varTesto: string): HTMLButtonElement {
    const pulsanti = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

    return pulsanti.find(p => p.textContent?.includes(varTesto)) as HTMLButtonElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the three buttons of the topology', () => {
    expect(pulsante("Salva")).toBeTruthy();
    expect(pulsante("Carica")).toBeTruthy();
    expect(pulsante("Cancella")).toBeTruthy();
  });

  it('should save the topology with the button', async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    localStorage.clear();

    pulsante("Salva").click();
    await fixture.whenStable();

    expect(localStorage.getItem(CHIAVE_TOPOLOGIA)).not.toBeNull();
  });
});
