import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../services';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  private provider: string;
  private params: Params;

  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => this.provider = params.provider);
    this._route.queryParams.subscribe(params => this.params = params);
    this.exchangeToken();
  }

  exchangeToken() {
    this._auth.socialAuth(this.provider, this.params).subscribe(
      data => {
        this._auth._authUser  = data.user;
        this._auth._authToken = data.token;
      },
      error => {
        this._router.navigate(['/auth/login']);
      },
      () => {
        this._router.navigate(['/home']);
      }
    );
  }



}
