import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {VotingService} from '../services/voting.service';
import {Voting} from '../model/Voting';
import {VotingResult} from '../model/VotingResult';
import { ToastrService } from 'ngx-toastr';

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
  votingResult: VotingResult;
  voting: Voting;

  votingStartForm = this.fb.group({
    votingId: ['']
  });

  votingEndForm = this.fb.group({
    votingId: ['']
  });


  votingResultForm = this.fb.group({
    votingId: ['']
  });

  constructor(private fb: FormBuilder, private votingService: VotingService,private toastr: ToastrService
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
        this.toastr.success('Voting started successfully.', 'Success');
      })
      .catch(error => {
        console.log('Start voting: ', error);
        if(error.stack.toString().includes('3746173')){
          this.toastr.error('Only the voting owner can start the voting.', 'Error');
        }else if(error.stack.toString().includes('3746573')){
          this.toastr.error('Voting has already started.', 'Error');
        } else{
          this.toastr.error('Failed to start the voting.', 'Error');
        }
      });
  }

  endVoting(event) {
    const votingId = this.votingEndForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));
    this.votingService.endVoting(votingId)
      .then(options => {
        console.log('End voting: ', options);
        this.toastr.success('Voting ended successfully.', 'Success');
      })
      .catch(error => {
        console.log('End voting: ', error);
        if(error.stack.toString().includes('3746561')){
          this.toastr.error('Voting does not exist.', 'Error');
        }else if(error.stack.toString().includes('3746573')){
          this.toastr.error('Voting has already ended.', 'Error');
        } else{
          this.toastr.error('Failed to end the voting.', 'Error');
        }
      });
  }

  getVoting(event) {
    const votingId = this.votingResultForm.value.votingId;
    this.votingService.getAccount().then(a => console.log('Account: ', a));
    this.percentage = [];
    this.votingService.getVotingResults(votingId)
      .then(voting => {
        console.log('getVoting: ', voting);
        this.votingResult = voting;
        this.numberOfVotes = this.votingResult.votesNo.reduce((a, b) => a + b, 0);
        this.votingResult.votesNo.forEach(vote => {
          this.percentage.push(this.numberOfVotes === 0 ? 0 : vote / this.numberOfVotes * 100);
        });
      })
      .catch(error => {
        console.log('Result: ', error);
      });

    this.votingService.getVoting(votingId)
      .then(voting => {
        this.voting = voting as unknown as Voting;
      })
      .catch(e => console.log(e));

  }

}
