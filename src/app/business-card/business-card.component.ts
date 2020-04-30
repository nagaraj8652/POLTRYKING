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
  postListAdv: any;
  sliderTwo: { isBeginningSlide: boolean; isEndSlide: boolean; slidesItems: { id: number; image: string; }[]; };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  constructor(private globalService: GlobalService, private router: Router, private route: ActivatedRoute) {
    this.postListAdv = [];
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.buinessDetails = this.router.getCurrentNavigation().extras.state.data;
        let i = 0;
        this.buinessDetails['products_list'].forEach(adv => {
          let image 
          if (adv.business_trans_img === null || adv.business_trans_img === '')
          {
            image = '../../assets/logo.jpg';
          }else {
            image = this.buinessDetails['PATH'] + adv.business_trans_img;
          }
          this.postListAdv.push({ id: i, image: image });
          i++;
        });
      }
    });

    this.sliderTwo = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.postListAdv
    };

  }

  ngOnInit() {

    console.log(this.buinessDetails);
    //this.getBusiness(this.route.snapshot.paramMap.get('id'));
  }

  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }


  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
