import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {VotingService} from '../services/voting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-voting',
  templateUrl: './create-voting.component.html',
  styleUrls: ['./create-voting.component.scss']
})
export class CreateVotingComponent implements OnInit {
  votingForm = this.fb.group({
    votingName: ['', Validators.required],
    question: ['', Validators.required],
    options: this.fb.array([]),
    addresses: this.fb.array([]),
  });

  options = this.votingForm.get('options') as FormArray;
  addresses = this.votingForm.get('addresses') as FormArray;
  showDeleteForOption = []
  showDeleteForAddress = []


  constructor(private fb: FormBuilder, private votingService: VotingService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const control = new FormControl('', Validators.required);
    this.options.push(control);
    const controlAddress = new FormControl('', [Validators.required]);
    this.addresses.push(controlAddress);

  }

  addOption() {
    const control = new FormControl('', Validators.required);
    this.options.push(control);
    this.showDeleteForOption.push(true)
    console.log('INSIDE ADD OPTION:', this);
  }
  
  deleteOption(index: any) {
    this.options.removeAt(index);
    this.showDeleteForOption.pop();
  }

  deleteAdress(index: any) {
    this.addresses.removeAt(index);
    this.showDeleteForAddress.pop();
  }

  addAddress() {
    const control = new FormControl('', [Validators.required]);
    this.addresses.push(control);
    this.showDeleteForAddress.push(true)
  }

  show(){
    window.onerror
  }


  createVoting($event) {
    console.log(this.votingForm);
    const voting = this.votingForm.value;
    this.votingService.createVoting(voting.votingName, voting.question, voting.options, voting.addresses)
    .then(options => {
      this.toastr.success('Voting created successfully.', 'Success');
    })
    .catch(error => {

      this.toastr.error('Failed to create the voting.', 'Error');
  
    });
  }

}
