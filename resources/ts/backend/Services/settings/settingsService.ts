import {AxiosService} from '../../Utils/AxiosService';

class Dropdown {
    countries = (id?: string) => AxiosService.get(`/list/countries?country_id=${id}`).then((res)=>res.data);
    // New methods for fetching timezones and languages
    timezones = (id?: string) => AxiosService.get(`/list/timezones?timezone_id=${id}`).then((res)=>res.data);
    languages = (id?:string) => AxiosService.get(`/list/languages?language_id=${id}`).then((res)=>res.data);
  }

  export const DropdownService = new Dropdown();
