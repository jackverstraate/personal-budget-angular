import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pb-article',
  standalone: true,
  templateUrl: './article.html',
  styleUrls: ['./article.scss']
})
export class Article implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }
}
