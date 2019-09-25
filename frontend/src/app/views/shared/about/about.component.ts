import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  btnGroupModel = {
    left: true,
    middle: false,
    right: false
  };
  // tabs: any[];
  constructor(private router: Router) {}

  ngOnInit() {

  }

  goHome(event) {
    if (event === 1) {
      this.router.navigate(['/item/list']);
    } else if (event === 2) {
      this.router.navigate(['/social/list']);
    } else if (event === 3) {
      this.router.navigate(['/item/add']);
    }
  }


}
