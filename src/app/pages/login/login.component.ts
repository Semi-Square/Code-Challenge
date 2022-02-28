import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/containers/core/services/common-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private commonService: CommonService, private router: Router) { }


  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/)]]
    });
  }


  get f() {
    return this.loginForm.controls;
  }


  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.commonService.showError('Please enter some valid data');
      return;
    }

    this.isLoading = true;

    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    this.commonService.postHttpCall({
      url: 'api/login',
      data: {
        email: username,
        password: password
      }
    }).subscribe(res => {
      this.commonService.showSuccess('Login successful');
      this.isLoading = false;
      localStorage.setItem('access-token', res.token);
      this.router.navigate(['/home']);
    }, err => {
      this.isLoading = false;
      this.commonService.showError(err.error.error);
    });
  }

}
