import { Component, ElementRef, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-show-password',
  templateUrl: './show-password.component.html',
  styleUrls: ['./show-password.component.css'],
})
export class ShowPasswordComponent implements OnInit {
  private _elRef: ElementRef = inject(ElementRef);
  constructor() {}

  ngOnInit(): void {}

  showPassword(): void {
    const passwordInput = this._elRef.nativeElement.previousElementSibling;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
