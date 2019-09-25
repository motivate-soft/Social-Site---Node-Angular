import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-list-pagination',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  ngOnInit() {
    document.getElementsByClassName('nav-link active_url')[0].className = 'nav-link active_url active';
    document.getElementsByClassName('nav-link active_url')[1].className = 'nav-link active_url';
    document.getElementsByClassName('nav-link active_url')[2].className = 'nav-link active_url';
  }

}
