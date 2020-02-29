import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  mobile: any;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router,private globalService: GlobalService) {
    this.mobile = this.route.snapshot.paramMap.get('mobile');
  }

  ngOnInit() {

  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }
  }

  otpp1; 
  otpp2; 
  otpp3; 
  otpp4;
  editMobile(){
    if(this.route.snapshot.paramMap.get('id') === '1'){
        this.router.navigate(['/forget']);
    }else{
      this.router.navigate(['/register']);
    }
  }

  verifyOTP(){
  
    if( this.otpp1 == '' || this.otpp2 == '' || this.otpp3 == '' || this.otpp4 == '' || this.otpp1 == undefined || this.otpp2 == undefined || this.otpp3 == undefined || this.otpp4 == undefined){
      this.error = "Enter OTP";
      return;
    }
    this.error = '';
    let formData = new FormData();
    formData.append('otp',this.otpp1+''+this.otpp2+''+this.otpp3+''+this.otpp4);
    formData.append('app_user_id', this.route.snapshot.paramMap.get('userId'));

    this.globalService.postData('verify_otp', formData).subscribe(res=>{
      if (res['status']){
        if(this.route.snapshot.paramMap.get('id') === '1'){
          this.router.navigate(['/reset',this.route.snapshot.paramMap.get('id')]);
        }else{
          this.router.navigate(['/login']);
        }
      } else {
          this.error = res.msg;
      }
    });

  }
}
