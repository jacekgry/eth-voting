import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eth-voting';

  votingSearchForm = this.fb.group({
    votingId: ['']
  });

  constructor(private fb: FormBuilder) {
  }

  searchForVoting(event) {
    console.log(this.votingSearchForm.value.votingId);
  }
}
