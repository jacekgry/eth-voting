import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {VotingService} from '../services/voting.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  options = [];
  votingId: string;
  searchSubmitted = false;

  votingSearchForm = this.fb.group({
    votingId: ['']
  });

  constructor(private fb: FormBuilder, private votingService: VotingService
  ) {
  }

  searchForVoting(event) {
    const votingId = this.votingSearchForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));

    this.votingService.getOptions(votingId)
      .then(options => {
        console.log('Voting options: ', options);
        this.options = options;
        this.votingId = votingId;
        this.searchSubmitted = true;
      })
      .catch(error => {
        this.votingId = null;
        this.options = [];
        this.votingSearchForm.reset();
        this.searchSubmitted = true;
      });
  }

}
