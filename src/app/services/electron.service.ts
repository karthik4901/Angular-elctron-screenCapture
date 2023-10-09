import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer!: typeof ipcRenderer  | undefined;

  constructor() {
    if(this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer
    }
   }



  get isElectron(): boolean{
     return !!(window && window.process && window.process.type);
  }
}
