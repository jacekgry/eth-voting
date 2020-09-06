import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {VotingService} from '../services/voting.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  options = [];
  votingId: string;
  searchSubmitted = false;
  question: string;
  selected: string;

  votingSearchForm = this.fb.group({
    votingId: ['']
  });

  constructor(private fb: FormBuilder, private votingService: VotingService, private toastr: ToastrService
  ) {
  }

  searchForVoting(event) {
    const votingId = this.votingSearchForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));

    this.votingService.getVoting(votingId)
      .then(options => {
        console.log('Voting options: ', options);
        this.question = options[0];
        this.options = options.slice(1);
        this.votingId = votingId;
        this.searchSubmitted = true;
        this.selected = this.options[0];
      })
      .catch(error => {
        this.votingId = null;
        this.options = [];
        this.searchSubmitted = true;
        this.question = null;
        this.selected = null;
      });
  }

  onSubmit() {
    console.log('in onSubmit');
    console.log(this.selected);
    this.votingService.vote(this.votingId, this.selected)
      .then(success => {
          this.toastr.success('Vote submitted successfully', 'Success');
        },
        error => {
          this.toastr.error('Failed to submit the vote', 'Error');
        });
  }

}
