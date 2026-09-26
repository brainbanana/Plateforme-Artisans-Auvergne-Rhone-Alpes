import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeArtisans } from './liste-artisans';

describe('ListeArtisans', () => {
  let component: ListeArtisans;
  let fixture: ComponentFixture<ListeArtisans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeArtisans],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeArtisans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
