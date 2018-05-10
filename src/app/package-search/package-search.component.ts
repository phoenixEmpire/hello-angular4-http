import { Component, OnInit } from '@angular/core';
import { PackageSearchService, NpmPackage } from './package-search.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'app-npm',
  templateUrl: './package-search.component.html',
  styleUrls: ['./package-search.component.css'],
  providers: [PackageSearchService]
})
export class PackageSearchComponent implements OnInit {

  private withRefresh = false;
  private searchText$ = new Subject<string>();
  private packages$: Observable<NpmPackage[]>;

  constructor(private npmService: PackageSearchService) { }

  ngOnInit() {
    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(packageName => this.npmService.search(packageName, this.withRefresh))
    );
  }

  search(packageName: string) {
    this.searchText$.next(packageName);
  }

  toggleRefresh() {
    this.withRefresh = !this.withRefresh;
  }

}
