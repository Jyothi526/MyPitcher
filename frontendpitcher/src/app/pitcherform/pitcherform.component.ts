import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PitcherService } from '../shared/pitcherservice/pitcher.service';

@Component({
  selector: 'app-pitcherform',
  templateUrl: './pitcherform.component.html',
  styleUrls: ['./pitcherform.component.scss']
})
export class PitcherformComponent implements OnInit {


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  data: any = [];
  pitchObj: [];
  length;


  constructor(public httpclient: HttpClient, public pitcherService: PitcherService) { }

  ngOnInit(): void { }
}
