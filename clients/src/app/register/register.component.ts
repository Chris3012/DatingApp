import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();
  constructor(
    private accountService: AccountService,
  ) {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        this.cancel();
      },
      error: (error) => {
        // this.toasterService.error(error.error);
        console.log(error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  ngOnInit(): void {}
}
