import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  terminalModel: any = {};
  widgetModel:  any = {};
  
  async search(city: string, bank: string) {
    let bankFetcher = BankFetcherFactory.createDataFetcher(bank, city);
    let results = await bankFetcher.fetchData();
    let terminal = PresenterFactory.createPresenter('terminal', results[0]);
    let widget = PresenterFactory.createPresenter('widget', results[0]);
    this.terminalModel = terminal.viewModel;
    this.widgetModel = widget.viewModel;
  }
}

export interface IAPIResult {
  address : {
    amenity: string,
    country: string,
    country_code: string,
    city: string,
    road: string
  },
  display_name: string
}

export interface ViewModel {
  bank: string,
  country: string,
  city: string,
  road: string,
  bankIconURL: string,
  countryIconURL: string,
  display_name: string
}

export class Bank {
  bankIconURL: string;
  countryIconURL: string;
  constructor(country_code: string){
    this.bankIconURL = "https://icon-library.com/images/bank-icon-vector/bank-icon-vector-8.jpg";
    switch (country_code) {
      case 'sk':
        this.countryIconURL = "https://cdn.countryflags.com/thumbs/slovakia/flag-400.png";
        break;
      case 'hu':
        this.countryIconURL = "https://cdn.countryflags.com/thumbs/hungary/flag-400.png";
        break;
      default:
        this.countryIconURL = "https://banner2.cleanpng.com/20180410/bvw/kisspng-computer-icons-globe-world-clip-art-globe-5acd31f76797c0.3831539515233971114243.jpg";
    };
  }
}

export class OTP extends Bank {
  constructor(country_code: string) {
    super(country_code);
    this.bankIconURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Otp_bank_Logo.svg/345px-Otp_bank_Logo.svg.png";
  }
}

export class CIB extends Bank {
  constructor(country_code: string) {
    super(country_code);
    if(country_code === 'hu')
      this.bankIconURL = "https://www.szamlazz.hu/wp-content/uploads/2021/05/cib_300x200.png";
    else if (country_code === 'sk')
      this.bankIconURL = "https://giffy.cz/img/loga/vub_banka.png";
  }
}


export abstract class DataFetcher {
  url = "https://nominatim.openstreetmap.org/search?format=json&type=bank&addressdetails=1";
  query = "";
  constructor(query:string) {
    this.query = query;
  }

  fetchData(): Promise<Array<IAPIResult>> {
    return fetch(this.url + '&' + this.query)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<Array<IAPIResult>>;
      });
  }
}

export class BankFetcher extends DataFetcher {
  constructor(bankname: string, cityname: string) {
    super(`q='${bankname},${cityname}`);
  }
}

export class CIBFetcher extends BankFetcher {
  constructor(cityname: string) {
    if(cityname ==='bratislava') super('vub', cityname);
    else super('cib', cityname);
  }
}


export abstract class Presenter {
  viewModel: any;
  constructor(apiResult: IAPIResult) {
    this.viewModel = this.mapAPIResultToModel(apiResult);
  }
  abstract mapAPIResultToModel(apiResult: IAPIResult): any;
}

export class PresenterFactory {
  static createPresenter(presenterType: string, apiResult: IAPIResult): Presenter {
    switch (presenterType) {
      case 'terminal':
        return new TerminalPresenter(apiResult);
      case 'widget':
        return new WidgetPresenter(apiResult);
      default:
        throw new Error('Unknown Presenter Type');
    }
  }
}

export interface TerminalModel {
    bank: string,
    country: string,
    city: string,
    road: string
}  

export class TerminalPresenter extends Presenter {
  mapAPIResultToModel(apiResult: IAPIResult): TerminalModel {
    return {
      bank: apiResult.address.amenity,
      country: apiResult.address.country,
      city: apiResult.address.city,
      road: apiResult.address.road
    } as TerminalModel;
  }

}

export interface WidgetModel {
  bankIconURL: string,
  countryIconURL: string,
  display_name: string
}

export class WidgetPresenter extends Presenter {
  mapAPIResultToModel(apiResult: IAPIResult): WidgetModel {
    let bankname = apiResult.address.amenity;
    let bank: Bank;
    switch (bankname) {
      case 'OTP Bank' || 'OTP Banka':
        bank = new OTP(apiResult.address.country_code);
        break;
      case 'CIB Bank' || 'Všeobecná úverová banka':
        bank = new CIB(apiResult.address.country_code);
        break;
      default:
        throw new Error('Unknown Bank Type');
    }

    return {
      bankIconURL: bank.bankIconURL,
      countryIconURL: bank.countryIconURL,
      display_name: apiResult.display_name
    } as WidgetModel;
  }
}

export class BankFetcherFactory {
  static createDataFetcher(bankname: string, cityname: string) {
    if(bankname == "cib") return new CIBFetcher(cityname);
    else return new BankFetcher(bankname, cityname);
  }
}



