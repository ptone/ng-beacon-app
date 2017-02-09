import { Component } from '@angular/core';

import { NgBeaconService } from './ng-beacon.service';
import { BluetoothUtilsService } from './bluetooth-utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  connecting = false;
  connected = false;
  beaconVersion = '';
  beaconSerialNum = '';
  beaconName = 'ng-beacon';
  debugLog = '';

  constructor(private ngBeacon: NgBeaconService, private bluetoothUtils: BluetoothUtilsService) {}

  connect() {
    this.connecting = true;
    this.beaconVersion = '';
    this.beaconSerialNum = '';
    this.ngBeacon.connect()
      .subscribe(() => {
        this.connecting = false;
        this.connected = true;
        this.ngBeacon.uart.receive$.subscribe(value => this.debugLog += value);
        this.ngBeacon.uart.lines$.subscribe(line => {
          if (!this.beaconVersion && line.indexOf('"VERSION"') >= 0) {
            this.beaconVersion = line.split('"')[3];
          }
          if (!this.beaconSerialNum && line.indexOf('"SERIAL"') >= 0) {
            this.beaconSerialNum = line.split('"')[3];
          }
        });
        this.ngBeacon.uart.sendText('\nprocess.env\n');
      });
  }

  clearLog() {
    this.debugLog = '';
  }

  uploadEddystone() {
    this.ngBeacon.uploadEddystone({name: this.beaconName});
  }

  uploadTemperature() {
    this.ngBeacon.uploadTemperature({name: this.beaconName});
  }

  uploadIBeacon() {
    this.ngBeacon.uploadIBeacon({name: this.beaconName});
  }
}
