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
    if(city ==='bratislava' && bank == "cib") bank = 'vub';
    let data = await this.fetchData(bank, city);
    let apiResult = data[0];
    let bankname = apiResult.address.amenity;
    let bankObj = new Bank(apiResult.address.country_code, bankname);
    let viewModel = {
      bank: apiResult.address.amenity,
      country: apiResult.address.country,
      city: apiResult.address.city,
      road: apiResult.address.road,
      bankIconURL: bankObj.bankIconURL,
      countryIconURL: bankObj.countryIconURL,
      display_name: apiResult.display_name
    } as ViewModel;
    this.terminalModel = {
      bank: viewModel.bank,
      country: viewModel.country,
      city: viewModel.city,
      road: viewModel.road
    };
    this.widgetModel = {
      bankIconURL: viewModel.bankIconURL,
      countryIconURL: viewModel.countryIconURL,
      display_name: viewModel.display_name
    };
  }

  url = "https://nominatim.openstreetmap.org/search?format=json&type=bank&addressdetails=1";
  fetchData(bankname: string, cityname: string): Promise<Array<IAPIResult>> {
    let query = `q='${bankname},${cityname}`;
    return fetch(this.url + '&' + query)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<Array<IAPIResult>>;
      });
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
  constructor(country_code: string, bankname: string){
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
    switch (bankname) {
      case 'OTP Bank':
        this.bankIconURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Otp_bank_Logo.svg/345px-Otp_bank_Logo.svg.png";
        break;
      case 'OTP banka':
        this.bankIconURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Otp_bank_Logo.svg/345px-Otp_bank_Logo.svg.png";
        break;
      case 'CIB Bank':
        this.bankIconURL = "https://www.szamlazz.hu/wp-content/uploads/2021/05/cib_300x200.png";
        break;
      case 'Všeobecná úverová banka':
        this.bankIconURL = "https://giffy.cz/img/loga/vub_banka.png";
        break;
      default:
        throw new Error('Unknown Bank Type');
    }
  }
}