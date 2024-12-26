import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

interface FileEntry {
  fileName: string;
  type: 'file' | 'url';
  value: string | File;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
// export class FileUploadComponent implements OnInit {
//   uploadForm: FormGroup;
//   filePreviews: { [key: number]: string | null } = {};
//   previewList: string[] = []; // To store previews after submission

//   constructor(private fb: FormBuilder) {
//     this.uploadForm = this.fb.group({
//       entries: this.fb.array([this.createEntry()]),
//     });
//   }

//   ngOnInit() {}

//   get entries(): FormArray {
//     return this.uploadForm.get('entries') as FormArray;
//   }

//   createEntry(): FormGroup {
//     return this.fb.group({
//       fileName: ['', [Validators.required, Validators.maxLength(255)]],
//       type: ['file', Validators.required],
//       value: [null, Validators.required],
//     });
//   }

//   addEntry(): void {
//     this.entries.push(this.createEntry());
//   }

//   removeEntry(index: number): void {
//     this.entries.removeAt(index);
//     delete this.filePreviews[index];
//   }

//   onFileChange(event: Event, index: number): void {
//     const fileInput = event.target as HTMLInputElement;
//     const file = fileInput?.files?.[0] || null;
//     if (file) {
//       this.entries.at(index).get('value')?.setValue(file);
//       const blobUrl = URL.createObjectURL(file);
//       this.filePreviews[index] = blobUrl;
//     }
//   }

//   onSubmit(): void {
//     console.log(this.filePreviews);
//     console.log(this.uploadForm);
    
//     if (this.uploadForm.valid) {
//       this.previewList = this.entries.value.map((entry: FileEntry) => {
//         if (entry.type === 'file' && entry.value instanceof File) {
//           return URL.createObjectURL(entry.value); // Return Blob URL
//         } else if (entry.type === 'url') {
//           return entry.value as string; // Return URL string
//         }
//         return '';
//       });

//       this.entries.clear(); // Clear all entries from UI
//       this.addEntry();
//     }
//   }

//   removePreview(index: number): void {
//     this.previewList.splice(index, 1); // Remove the selected preview
//   }
// }



export class FileUploadComponent implements OnInit {
  uploadForm: FormGroup;
  filePreviews: { [key: number]: { fileName: string; previewUrl: string | null } } = {};
  previewList: { fileName: string; previewUrl: string }[] = []; // To store previews after submission

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      entries: this.fb.array([this.createEntry()]),
    });
  }

  ngOnInit() {}

  get entries(): FormArray {
    return this.uploadForm.get('entries') as FormArray;
  }

  createEntry(): FormGroup {
    return this.fb.group({
      fileName: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['file', Validators.required],
      value: [null, Validators.required],
    });
  }

  addEntry(): void {
    this.entries.push(this.createEntry());
  }

  removeEntry(index: number): void {
    this.entries.removeAt(index);
    delete this.filePreviews[index];
  }

  onFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;
    if (file) {
      this.entries.at(index).get('value')?.setValue(file);
      this.entries.at(index).get('fileName')?.setValue(file.name); // Set file name in the form
      const blobUrl = URL.createObjectURL(file);
      this.filePreviews[index] = { fileName: file.name, previewUrl: blobUrl };
    }
  }

  onSubmit(): void {
    console.log(this.filePreviews);
    console.log(this.uploadForm);

    if (this.uploadForm.valid) {
      this.previewList = this.entries.value.map((entry: any) => {
        if (entry.type === 'file' && entry.value instanceof File) {
          return { fileName: entry.fileName, previewUrl: URL.createObjectURL(entry.value) }; // Store name and URL
        } else if (entry.type === 'url') {
          return { fileName: entry.fileName, previewUrl: entry.value as string }; // Store name and URL
        }
        return { fileName: '', previewUrl: '' };
      });
      this.entries.clear(); // Clear all entries from UI
      this.filePreviews = {};
      this.addEntry();
    }
  }

  removePreview(index: number): void {
    this.previewList.splice(index, 1); // Remove the selected preview
  }
}
