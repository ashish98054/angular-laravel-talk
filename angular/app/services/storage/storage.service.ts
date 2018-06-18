import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItem(key: string) {
    let item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }

  setItem(key: string, value: string|object) {
    if(typeof value == 'object') {
      value = JSON.stringify(value);
    }
    return localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    return localStorage.removeItem(key);
  }

  clear() {
    return localStorage.clear();
  }
}
