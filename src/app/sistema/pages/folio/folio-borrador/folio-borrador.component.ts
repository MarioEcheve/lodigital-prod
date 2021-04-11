import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { AppService } from '../../../../app.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-folio-borrador',
  templateUrl: './folio-borrador.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-markdown-editor/ngx-markdown-editor.scss',
    '../../../../../vendor/libs/quill/typography.scss',
    '../../../../../vendor/libs/quill/editor.scss',
    '../../../../../vendor/libs/ngx-dropzone-wrapper/ngx-dropzone-wrapper.scss',
    './folio-borrador.component.scss',
    '../../../../../vendor/libs/ngb-datepicker/ngb-datepicker.scss',
    '../../../../../vendor/libs/ngb-timepicker/ngb-timepicker.scss',
    '../../../../../vendor/libs/ngx-color-picker/ngx-color-picker.scss'
   
  ]
})
export class FolioBorradorComponent implements OnInit {
  isRTL: boolean;
  constructor(private appService: AppService,calendar: NgbCalendar) {
    this.appService.pageTitle = 'LODigital - Folio Borrador';
    this.isRTL = appService.isRTL;

    //
    // Ngb Datepicker
    //

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  //
  // ngx-dropzone-wrapper
  //

  dropzoneConfig = {
    url: '/upload',
    parallelUploads: 2,
    maxFilesize:     50000,
    filesizeBase:    1000,
    addRemoveLinks:  true,
    previewTemplate: `
      <div class="dz-preview dz-file-preview">
        <div class="dz-details">
          <div class="dz-thumbnail">
            <img data-dz-thumbnail>
            <span class="dz-nopreview">No preview</span>
            <div class="dz-success-mark"></div>
            <div class="dz-error-mark"></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <div class="progress">
              <div class="progress-bar progress-bar-primary"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                data-dz-uploadprogress></div>
            </div>
          </div>
          <div class="dz-filename" data-dz-name></div>
          <div class="dz-size" data-dz-size></div>
        </div>
      </div>`
  };

  // ***************************************************************************
  // Mock the file upload progress (only for the demo)
  //

  @ViewChild(DropzoneDirective) dropzoneInstance: DropzoneDirective;

  ngAfterViewInit() {
    const component = this;

    this.dropzoneInstance.dropzone().uploadFiles = function(files) {
      const minSteps         = 6;
      const maxSteps         = 60;
      const timeBetweenSteps = 100;
      const bytesPerStep     = 100000;
      const isUploadSuccess  = Math.round(Math.random());

      const self = this;

      for (let i = 0; i < files.length; i++) {

        const file = files[i];
        const totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

        for (let step = 0; step < totalSteps; step++) {
          const duration = timeBetweenSteps * (step + 1);

          setTimeout(function(_file, _totalSteps, _step) {
            return function() {
              _file.upload = {
                progress: 100 * (_step + 1) / _totalSteps,
                total: _file.size,
                bytesSent: (_step + 1) * _file.size / _totalSteps
              };

              self.emit('uploadprogress', _file, _file.upload.progress, _file.upload.bytesSent);
              if (_file.upload.progress === 100) {

                if (isUploadSuccess) {
                  _file.status = component.dropzoneInstance.DZ_SUCCESS;
                  self.emit('success', _file, 'success', null);
                } else {
                  _file.status = component.dropzoneInstance.DZ_ERROR;
                  self.emit('error', _file, 'Some upload error', null);
                }

                self.emit('complete', _file);
                self.processQueue();
              }
            };
          }(file, totalSteps, step), duration);
        }
      }
    };
  }

  //
  // ng2-file-upload
  //

  uploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  hasBaseDropZoneOver = false;

  fileOver(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  ngOnInit(){}

  model: NgbDateStruct = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };

  displayMonths = 2;
  navigation = 'select';
  disabled = false;

  // Range datepicker

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
}
