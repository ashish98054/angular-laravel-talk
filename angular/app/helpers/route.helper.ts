import { Injectable } from '@angular/core';

import { Routes } from '../../routes';
import { RouteInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RouteHelper {
  private routes:Array<RouteInterface> = Routes;

  constructor() {}

  route(routeName:string,param?:object) {
    let route = this.findRoute(this.routes, routeName);
    if(route && param) {
      route = this.routeParams(route, param);
    }
    return route;
  }

  findRoute(routes:Array<RouteInterface>, routeName:string) {
    let route = routes.find(route => route.name == routeName);
    return route ? route.uri : '';
  }

  routeParams(route:string,params:object) {
    let queryParams:Array<string> = [];
    for (let key in params) {
      let param = params[key].toString();
      if (route.indexOf(`{${key}?}`) != -1) {
        route = route.replace(`{${key}?}`, param);
      } else if (route.indexOf(`{${key}}`) != -1) {
        route = route.replace(`{${key}}`, param);
      } else {
        queryParams[key] = param;
      }
    }

    route = this.cleanUpUrl(route);
    if (Object.keys(queryParams).length) {
      route = `${route}${this.queryParams(queryParams)}`;
    }
    return route;
  }

  queryParams(params:Array<string>) {
    let queryParam:Array<string> = [];
    for (let key in params) {
      queryParam.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`);
    }
    return `?${queryParam.join('&')}`;
  }

  cleanUpUrl(url:string) {
    url.replace(/([^:]\/)\/+/g, "$1");
    if(url.substr(-1) == '/') {
      return url.substr(0, url.length - 1);
    }
    return url;
  }
}
