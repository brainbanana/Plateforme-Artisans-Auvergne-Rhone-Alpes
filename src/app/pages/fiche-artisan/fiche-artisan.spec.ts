import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FicheArtisan } from './fiche-artisan';

describe('FicheArtisan', () => {
  let component: FicheArtisan;
  let fixture: ComponentFixture<FicheArtisan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheArtisan],
    }).compileComponents();

    fixture = TestBed.createComponent(FicheArtisan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
