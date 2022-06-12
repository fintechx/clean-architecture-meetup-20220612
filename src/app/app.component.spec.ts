import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render Budapest OTP', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const okResponse = new Response(JSON.stringify([
      {
        "place_id": 17802899,
        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
        "osm_type": "node",
        "osm_id": 1985472286,
        "boundingbox": [
            "47.4269015",
            "47.4270015",
            "19.0702578",
            "19.0703578"
        ],
        "lat": "47.4269515",
        "lon": "19.0703078",
        "display_name": "OTP Bank, Karácsony Sándor utca, Csepel-Belváros, 21st district, Budapest, XXI. kerület, Central Hungary, 1211, Hungary",
        "class": "amenity",
        "type": "bank",
        "importance": 0.201,
        "icon": "https://nominatim.openstreetmap.org/ui/mapicons/money_bank2.p.20.png",
        "address": {
            "amenity": "OTP Bank",
            "road": "Karácsony Sándor utca",
            "suburb": "Csepel-Belváros",
            "city_district": "21st district",
            "city": "Budapest",
            "district": "XXI. kerület",
            "region": "Central Hungary",
            "postcode": "1211",
            "country": "Hungary",
            "country_code": "hu"
        }
      }
    ]), {
      status: 200,
      statusText: 'OK',
    });
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(okResponse));
    const app = fixture.componentInstance;
    await app.search('budapest', 'otp');
    expect(window.fetch).toHaveBeenCalled();
    expect(app.widgetModel).toEqual({bankIconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Otp_bank_Logo.svg/345px-Otp_bank_Logo.svg.png', countryIconURL: 'https://cdn.countryflags.com/thumbs/hungary/flag-400.png', display_name: 'OTP Bank, Karácsony Sándor utca, Csepel-Belváros, 21st district, Budapest, XXI. kerület, Central Hungary, 1211, Hungary'});
    expect(app.terminalModel).toEqual({bank: 'OTP Bank', country: 'Hungary', city: 'Budapest', road: 'Karácsony Sándor utca'});
  });
});
