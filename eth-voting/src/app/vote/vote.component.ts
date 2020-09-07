import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {VotingService} from '../services/voting.service';
import {ToastrService} from "ngx-toastr";
import {Voting} from "../model/Voting";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  votingId: string;
  searchSubmitted = false;
  selected: string;
  voting: Voting;

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
      .then(voting => {
        console.log('Voting voting: ', voting);
        this.voting = voting;
        this.votingId = votingId;
        this.searchSubmitted = true;
        this.selected = this.voting.options[0];
      })
      .catch(error => {
        this.votingId = null;
        this.searchSubmitted = true;
        this.selected = null;
        this.voting = null;
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
