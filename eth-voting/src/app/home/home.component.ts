import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {VotingService} from '../services/voting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  options;
  votes;
  percentage;
  numberOfVotes;
  numberOfAllVoters;
  isEnded;

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
    const votingId = this.votingEndForm.value.votingId;
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

    const votingId = this.votingResultForm.value.votingId;
    console.log('voting id: ', votingId);
    this.votingService.getAccount().then(a => console.log('Account: ', a));
    this.percentage.splice(0);
    this.votingService.getVotes(votingId)
      .then(votes => {
        console.log('Result: ', votes);
        this.votes = votes.map(Number);
        this.numberOfVotes = votes.reduce((a, b) => a + b, 0)
        this.votes.forEach(vote => {
          this.percentage.push((vote as unknown as number) / this.numberOfVotes  * 100)
        })
      })
      .catch(error => {
        console.log('Result: ', error);
      });

    this.votingService.getVoting(votingId)
      .then(options => {
        console.log('Result: ', options);
        this.options = options.slice(1);
      })
      .catch(error => {
        console.log('Result: ', error);
      });
  }



}
