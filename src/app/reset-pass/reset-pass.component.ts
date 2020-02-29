import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss'],
})
export class ResetPassComponent implements OnInit {
  error: string;

  constructor(private router: Router,private route: ActivatedRoute,private globalService: GlobalService) { }

  ngOnInit() {}

  pass;
  cpass;
  reset(){
    if(this.pass !== this.cpass){
      this.error = "Password should match";
      return;
    }
    this.error = '';

    let formData = new FormData();
    formData.append('new_password', this.pass);
    formData.append('app_user_id',this.route.snapshot.paramMap.get('id'));

    this.globalService.postData('change_password', formData).subscribe(res=>{
      if (res['status']){
        this.router.navigate(['/login']);
      }else{
        this.error = res['msg'];
      }
    });
  }
}
