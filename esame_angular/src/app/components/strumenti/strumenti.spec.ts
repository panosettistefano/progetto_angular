import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
