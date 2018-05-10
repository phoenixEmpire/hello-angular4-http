import { Component, OnInit } from '@angular/core';
import { BasicUsageService } from './basic-usage.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-title',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.css'],
  providers: [BasicUsageService]
})
export class BasicUsageComponent implements OnInit {

  title: string;
  headers: string[] = [];

  constructor(private basicUsageService: BasicUsageService) { }

  ngOnInit() {
    this.showTitle();
  }

  showTitle() {
    this.basicUsageService.getTitle().subscribe(
      (res: HttpResponse<string>) => {
        this.title = this.getTitle(res.body);
        const keys = res.headers.keys();
        this.headers = keys.map(
          (key: string) => {
            return `${key} : ${res.headers.get(key)}`;
          }
        );
      }
    );
  }

  getTitle(page: string): string {
    return page.substring(page.indexOf('<title>') + 7, page.indexOf('</title>'));
  }
}
