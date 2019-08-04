import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { BackgroundService } from 'src/app/services/Background.service';
import { BackgroundList } from 'src/app/models/HttpResponses/BackgroundList';
import { BackgroundListRequest } from 'src/app/models/HttpRequests/BackgroundList';
import { BackgroundListResponse } from 'src/app/models/HttpResponses/BackgroundListResponse';
import { environment } from 'src/environments/environment';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { Pagination } from 'src/app/models/Pagination';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ImageModalOptions } from 'src/app/models/ImageModalOptions';

@Component({
  selector: 'app-view-backgrounds-list',
  templateUrl: './view-backgrounds-list.component.html',
  styleUrls: ['./view-backgrounds-list.component.scss']
})
export class ViewBackgroundsListComponent implements OnInit {
  constructor(private themeService: ThemeService, private backgroundService: BackgroundService) {}

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';
  backgroundPath = environment.ApiBackgroundImages;
  backgroundList: BackgroundList[];
  backgroundRequestModel: BackgroundListRequest;
  selectRowDisplay: number;
  totalRowCount: number;
  totalDisplayCount: number;
  activePage: number;
  prevPageState: boolean;
  nextPageState: boolean;
  prevPage: number;
  nextPage: number;
  pages: Pagination[];
  showingPages: Pagination[];

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();

    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });

    this.selectRowDisplay = 15;
    this.backgroundRequestModel = {
      userID: 3, // Default User ID for testing
      specificBackgroundID: -1,
      rightName: 'Backgrounds',
      filter: '',
      orderBy: 'Name',
      orderByDirection: 'ASC',
      rowStart: 1,
      rowEnd: 15
    };

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    this.loadBackgrounds();
  }

  loadBackgrounds() {
    this.backgroundService.getBackgrounds(this.backgroundRequestModel).then(
      (res: BackgroundListResponse) => {
        this.backgroundList = res.backgroundList;
        this.totalRowCount = res.rowCount;
        this.totalDisplayCount = res.backgroundList.length;
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Unable to reach server.');
      });
  }

  removeBackground(backgroundID: number) {

  }

  editBackground(backgroundID: number) {

  }

  viewBackground(src: string) {
    const options = new ImageModalOptions();
    options.width = '100%';

    this.imageModal.open(`${environment.ApiBackgroundImages}/${src}`, options);
  }

  searchBar() {
    this.backgroundRequestModel.rowStart = 1;
    this.backgroundRequestModel.rowEnd = this.selectRowDisplay;
    this.loadBackgrounds();
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.backgroundRequestModel.rowStart = page.rowStart;
    this.backgroundRequestModel.rowEnd = page.rowEnd;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    let pagenumber = +this.totalRowCount / +this.selectRowDisplay;
    const mod = +this.totalRowCount % +this.selectRowDisplay;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.updatePagination();
    this.loadBackgrounds();
  }

  updatePagination() {
    this.showingPages = Array<Pagination>();
    this.showingPages[0] = this.pages[this.activePage - 1];
    const pagenumber = +this.totalRowCount / +this.selectRowDisplay;

    if (this.activePage < pagenumber) {
      this.showingPages[1] = this.pages[+this.activePage];

      if (this.showingPages[1] === undefined) {
        const page = new Pagination();
        page.page = 1;
        page.rowStart = 1;
        page.rowEnd = this.backgroundRequestModel.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }
}
