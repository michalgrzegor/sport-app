import { Component} from '@angular/core';
import { FabBtnAnimations } from './fab-btn.animations';

@Component({
  selector: 'app-fab-btn',
  templateUrl: './fab-btn.component.html',
  styleUrls: ['./fab-btn.component.scss'],
  animations: FabBtnAnimations
})
export class FabBtnComponent {

  fabbuttons = [
    {
      icon: 'star'
    },
    {
      icon: 'arrow_downward'
    },
    {
      icon: 'delete'
    },
    {
      icon: 'assignment_turned_in'
    },
    {
      icon: 'file_copy'
    },
    {
      icon: 'repeat'
    },
    {
      icon: 'add'
    }
  ];

  buttons = [];
  fabTogglerState = 'inactive';

  constructor() { }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabbuttons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

}
