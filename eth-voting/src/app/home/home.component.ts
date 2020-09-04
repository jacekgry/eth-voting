import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { VotingService } from '../services/voting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  votingStartForm = this.fb.group({
    votingId: ['']
  });

  votingEndForm = this.fb.group({
    votingId: ['']
  });


  votingResultForm = this.fb.group({
    votingId: ['']
  });

  constructor(private fb: FormBuilder, private votingService: VotingService
  ) {
  }

  ngOnInit(): void {
  }


  startVoting(event) {
    const votingId = this.votingStartForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));

    this.votingService.startVoting(votingId)
      .then(options => {
        console.log('Start voting: ', options);
      })
      .catch(error => {
        console.log('Start voting: ', error);
      });
  }

  endVoting(event) {
    const votingId = this.votingStartForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));

    this.votingService.endVoting(votingId)
      .then(options => {
        console.log('End voting: ', options);
      })
      .catch(error => {
        console.log('End voting: ', error);
      });
  }

  getVotingResult(event) {

   const votingId = this.votingStartForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));

    this.votingService.getVotes(votingId)
      .then(options => {
        console.log('Result: ', options);
      })
      .catch(error => {
        console.log('Result: ', error);
      });
  }



}
