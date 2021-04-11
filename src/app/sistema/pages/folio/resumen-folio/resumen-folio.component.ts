import { AfterViewInit, Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../../../app.service';
import { LayoutService } from '../../../../layout/layout.service';


@Component({
  selector: 'app-resumen-folio',
  templateUrl: './resumen-folio.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-perfect-scrollbar/ngx-perfect-scrollbar.scss',
    '../../../../../vendor/styles/pages/messages.scss',
    './resumen-folio.component.scss',
  ],
})
export class ResumenFolioComponent implements AfterViewInit {

  constructor(private appService: AppService, private layoutService: LayoutService) {
    this.appService.pageTitle = 'Message list v1 - Pages';
  }

  sideboxOpen = false;
  selected: any = [];

  // Mail boxes
  currentMailBox = 'inbox';
  mailBoxes = {
    inbox: { title: 'Folios Emitidos', icon: 'ion ion-ios-filing', count: 150 },
    sent: { title: 'Folios Mandante', icon: 'ion ion ion-ios-mail', count: 150 },
    drafts: { title: 'Folios Contratista', icon: 'ion ion ion-md-create', count: 150 },
    spam3: { title: 'Sin Respuesta', icon: 'ion ion ion-md-folder-open', count: 150 },
    spam: { title: 'Sin Confirmar', icon: 'ion ion ion-md-folder-open', count: 150 },
    spam2: { title: 'Mis Favoritos', icon: 'ion ion ion-md-folder-open', count: 150 },
    trash: { title: 'Borradores', icon: 'ion ion ion-md-create', count: 150 }
  };

  // Labels
  labels = {
    clients: { title: 'Clients', color: 'success' },
    important: { title: 'Important', color: 'danger' },
    social: { title: 'Social', color: 'info' },
    other: { title: 'Other', color: 'warning' }
  };

  // Messages
  messagesData = [
    { marked: false, label: 'social', unread: true, attachments: false, sender: 'Facebook', subject: 'Reset your account password', date: '1d ago' },
    { marked: true, label: null, unread: false, attachments: false, sender: 'Mae Gibson', subject: 'Street Photography Competition', date: '1d ago' },
    { marked: false, label: 'important', unread: false, attachments: false, sender: 'GitHub', subject: '[GitHub] Your password has been changed', date: '1d ago' },
    { marked: true, label: 'clients', unread: true, attachments: true, sender: 'Nelle Maxwell', subject: 'New design concepts', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Dropbox', subject: 'Complete your Dropbox setup', date: '1d ago' },
    { marked: false, label: 'other', unread: false, attachments: false, sender: 'Task manager', subject: 'You have 5 overdue tasks!', date: '1d ago' },
    { marked: false, label: 'social', unread: true, attachments: false, sender: 'Facebook', subject: 'Reset your account password', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Mae Gibson', subject: 'Street Photography Competition', date: '1d ago' },
    { marked: false, label: 'important', unread: false, attachments: false, sender: 'GitHub', subject: '[GitHub] Your password has been changed', date: '1d ago' },
    { marked: false, label: 'clients', unread: true, attachments: true, sender: 'Nelle Maxwell', subject: 'New design concepts', date: '1d ago' },
    { marked: true, label: null, unread: false, attachments: false, sender: 'Dropbox', subject: 'Complete your Dropbox setup', date: '1d ago' },
    { marked: false, label: 'other', unread: false, attachments: false, sender: 'Task manager', subject: 'You have 5 overdue tasks!', date: '1d ago' },
    { marked: false, label: 'social', unread: true, attachments: false, sender: 'Facebook', subject: 'Reset your account password', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Mae Gibson', subject: 'Street Photography Competition', date: '1d ago' },
    { marked: false, label: 'important', unread: false, attachments: false, sender: 'GitHub', subject: '[GitHub] Your password has been changed', date: '1d ago' },
    { marked: false, label: 'clients', unread: true, attachments: true, sender: 'Nelle Maxwell', subject: 'New design concepts', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Dropbox', subject: 'Complete your Dropbox setup', date: '1d ago' },
    { marked: false, label: 'other', unread: false, attachments: false, sender: 'Task manager', subject: 'You have 5 overdue tasks!', date: '1d ago' },
    { marked: false, label: 'social', unread: true, attachments: false, sender: 'Facebook', subject: 'Reset your account password', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Mae Gibson', subject: 'Street Photography Competition', date: '1d ago' },
    { marked: false, label: 'important', unread: false, attachments: false, sender: 'GitHub', subject: '[GitHub] Your password has been changed', date: '1d ago' },
    { marked: false, label: 'clients', unread: true, attachments: true, sender: 'Nelle Maxwell', subject: 'New design concepts', date: '1d ago' },
    { marked: false, label: null, unread: false, attachments: false, sender: 'Dropbox', subject: 'Complete your Dropbox setup', date: '1d ago' },
    { marked: false, label: 'other', unread: false, attachments: false, sender: 'Task manager', subject: 'You have 5 overdue tasks!', date: '1d ago' },
    { marked: false, label: 'social', unread: true, attachments: false, sender: 'Facebook', subject: 'Reset your account password', date: '1d ago' }
  ];

  ngAfterViewInit() {
    setTimeout(() => this.layoutService.setCollapsed(true, false));
  }

  objectKeys(o) {
    return Object.keys(o);
  }

  toggleSelect($event, message) {
    if ($event.target.checked) {
      this.selected.push(message);
    } else {
      this.selected.splice(this.selected.indexOf(message), 1);
    }
  }

}
