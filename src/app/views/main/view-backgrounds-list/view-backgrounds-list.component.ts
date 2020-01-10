import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { BackgroundService } from 'src/app/services/Background.service';
import { environment } from 'src/environments/environment';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { Pagination } from 'src/app/models/Pagination';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { FormGroup } from '@angular/forms';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { BackgroundList, BackgroundListResponse, BackgroundsAdd } from 'src/app/models/HttpResponses/Backgrounds';
import { BackgroundListRequest } from 'src/app/models/HttpRequests/Backgrounds';
import { User } from 'src/app/models/HttpResponses/User';
import { UserService } from 'src/app/services/user.Service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-backgrounds-list',
  templateUrl: './view-backgrounds-list.component.html',
  styleUrls: ['./view-backgrounds-list.component.scss']
})
export class ViewBackgroundsListComponent implements OnInit, OnDestroy {
  constructor(
    private themeService: ThemeService,
    private backgroundService: BackgroundService,
    private snackbarService: HelpSnackbar,
    private userService: UserService,
    ) {}

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openUploadModal', { static: true })
  openUploadModal: ElementRef;
  @ViewChild('closeUploadModal', { static: true })
  closeUploadModal: ElementRef;

  @ViewChild('openViewBackgroundModal', { static: true })
  openViewBackgroundModal: ElementRef;

  @ViewChild('myInput', { static: false })
  myInputVariable: ElementRef;

  currentTheme = 'light';
  backgroundPath = environment.ApiBackgroundImages;
  backgroundList: BackgroundList[];
  backgroundRequestModel: BackgroundListRequest;
  currentUser: User = this.userService.getCurrentUser();
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
  fileName: string;
  uploadForm: FormGroup;
  fileToUpload: File = null;
  preview: any;
  srcImage: any;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.selectRowDisplay = 15;
    this.backgroundRequestModel = {
      userID: this.currentUser.userID, // Default User ID for testing
      specificBackgroundID: -1,
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
        console.log(JSON.stringify(msg));
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      });
  }

  removeBackground(backgroundID: number) {
    this.backgroundService.removeBackgrounds(+backgroundID, this.currentUser.userID).then(
      (res: BackgroundListResponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg( res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
            this.notify.successmsg( res.outcome.outcome, res.outcome.outcomeMessage);
            this.loadBackgrounds();
        }
      },
      (msg) => {
        console.log(JSON.stringify(msg));
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      });
  }



  viewBackground(src: string) {
    this.srcImage = `${environment.ApiBackgroundImages}/${src}`;
    this.openViewBackgroundModal.nativeElement.click();
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

  AddBackgroud() {
    this.fileToUpload = null;
    this.fileName = '';
    this.preview = null;
    this.myInputVariable.nativeElement.value = '';
    this.openUploadModal.nativeElement.click();
  }

  uploadBackground() {
    let errors = 0;

    if (this.fileName === '' ||  undefined) {
      errors++;
    }

    if (this.fileToUpload === null || undefined) {
      errors++;
    }

    if (errors === 0) {
      this.backgroundService.addBackgrounds(
        this.fileName,
        this.fileToUpload,
        this.currentUser.userID
        ).then(
          (res: BackgroundsAdd) => {
            if (res.outcome.outcome === 'SUCCESS') {
                this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
                this.backgroundRequestModel.rowStart = 1;
                this.backgroundRequestModel.rowEnd = 15;
                this.closeUploadModal.nativeElement.click();
                this.loadBackgrounds();
            } else {
              this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            }
          },
          (msg) => {
            this.notify.errorsmsg('Failure', 'Something went wrong...');
          }
        );
    } else {
      this.notify.toastrwarning('Warning', 'Please choose an image before saving.');
    }
  }

  onFileChange(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = files.item(0).name;
  }

  readFile(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug,
    };

    this.snackbarService.setHelpContext(newContext);
  }
  Closemodal() {
    this.myInputVariable.nativeElement.value = '';
    this.preview = null;
    this.fileToUpload = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
