import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent implements OnInit {

  buinessDetails : [];
  constructor(private globalService: GlobalService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.buinessDetails = this.router.getCurrentNavigation().extras.state.data;
      }
    });
  }

  ngOnInit() {

    console.log(this.buinessDetails);
    //this.getBusiness(this.route.snapshot.paramMap.get('id'));
  }

}
