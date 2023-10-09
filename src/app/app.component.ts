import { Component,NgZone } from '@angular/core';
import { ElectronService } from './services/electron.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  [x: string]: any;

  private ipcRenderer:Electron.CrossProcessExports.IpcRenderer | undefined;
  
  constructor(private electronService: ElectronService, private ngZone: NgZone) {
      this.ipcRenderer = electronService.ipcRenderer;
  }

  captureScreenshot() {
    // Trigger the IPC event to capture the screenshot
    this.ipcRenderer?.send('capture-screenshot');

    // Listen for the confirmation message from the main process
    this.ipcRenderer?.on('screenshot-captured', (event, screenshotPath) => {
      // Handle the screenshot path in the Angular component
      this.ngZone.run(() => {
        console.log('Screenshot captured:', screenshotPath);
        // Use the screenshotPath as needed in your Angular component
      });
    });
  }
}
