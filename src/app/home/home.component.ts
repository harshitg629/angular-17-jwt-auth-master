import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  displayedColumns: string[] = ['studentId', 'firstName', 'lastName', 'dob', 'className', 'score'];
  dataSource: any[] = []; 
  pageSizeOptions = [2, 5, 10]; // Options for page size
  pageSize = this.pageSizeOptions[0]; // Default page size
  currentPage = 0; 
  studentResposne: any;
  downloadInProgress = false; // Track download progress
  downloadMessage = ''; // Message to show download status
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getStudentData().subscribe({
      next:res => {
        this.dataSource= res;
        console.log('dddd', this?.dataSource)
      },
      error: err => {
        console.error('Error fetching student data:', err);
      }
    })
  
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
  // exportToExcel() {
  //   this.userService.getExcel().subscribe({
  //     next: (res) => {
  //       // Create a Blob from the response
  //       const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
  //       // Create a link element to trigger the download
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = 'student_data.xlsx'; // Name of the file to download
  //       link.click();

  //       // Clean up the URL.createObjectURL to release memory
  //       window.URL.revokeObjectURL(link.href);
  //     },
  //     error: (err) => {
  //       console.error('Error downloading Excel file:', err);
  //     }
  //   });
  // }
  exportToExcel() {
    this.downloadInProgress = true;
    this.downloadMessage = 'Downloading file...';

    this.userService.getExcel().subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'student_data.xlsx';
        link.click();

        window.URL.revokeObjectURL(link.href);

        this.downloadMessage = 'Download completed!';
        this.downloadInProgress = false;
      },
      error: (err) => {
        console.error('Error downloading Excel file:', err);
        this.downloadMessage = 'Error downloading file.';
        this.downloadInProgress = false;
      }
    });
  }
  selectedFile: File | null = null; 
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];  // Capture the file from input
  }

  // Method to upload the selected Excel file
  onUpload(): void {
    if (this.selectedFile) {
      this.userService.uploadExcel(this.selectedFile)
        .subscribe(
          (response) => {
            console.log('File successfully uploaded', response);
          },
          (error) => {
            console.error('Error uploading file', error);
          }
        );
    } else {
      console.warn('No file selected!');
    }
  }
  get paginatedData() {
    const start = this?.currentPage * this?.pageSize;
    return this.dataSource?.slice(start, start + this?.pageSize);
  }
  get totalPages(): number {
    return Math?.ceil(this?.dataSource?.length / this?.pageSize);
  }
}
