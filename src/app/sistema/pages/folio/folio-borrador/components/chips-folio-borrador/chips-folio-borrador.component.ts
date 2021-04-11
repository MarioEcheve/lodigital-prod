import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chips-folio-borrador',
  templateUrl: './chips-folio-borrador.component.html',
  styleUrls: [
    '../../../../../../../vendor/libs/ngx-chips/ngx-chips.scss',
    '../../../../../../../vendor/libs/ng2-dropdown-menu/ng2-dropdown-menu.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChipsFolioBorradorComponent implements OnInit {
  items = ['Spider-Man', 'Superman', 'Iron Man'];
  autocompleteItems = [
    'Spider-Man', 'Superman', 'Iron Man', 'Wolverine', 'Captain America', 'Ant-Man',
    'Wonder Woman', 'Hulk', 'Flash', 'Green Arrow', 'Silver Surfer', 'Thor', 'Batman',
    'Deadpool', 'The Green Lantern', 'Daredevil', 'Black Widow', 'Hawkeye', 'Catwoman',
  ];
  disabled = false;
  constructor() { }

  ngOnInit() {
  }

}
