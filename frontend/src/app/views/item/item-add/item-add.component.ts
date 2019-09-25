import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-item-add-form',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.scss']
})


export class ItemAddComponent implements OnInit {
  ngOnInit() {
    document.getElementsByClassName('nav-link active_url')[0].className = 'nav-link active_url';
    document.getElementsByClassName('nav-link active_url')[1].className = 'nav-link active_url';
    document.getElementsByClassName('nav-link active_url')[2].className = 'nav-link active_url active';
  }

}


