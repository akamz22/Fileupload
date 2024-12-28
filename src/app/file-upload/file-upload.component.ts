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
      this.entries.at(index).get('value')?.setValue(file); // Set the file in the form
      const blobUrl = URL.createObjectURL(file);
      this.filePreviews[index] = { fileName: file.name, previewUrl: blobUrl }; // Store preview for display purposes
    }
  }
  
  onSubmit(): void {
    if (this.uploadForm.valid) {
      this.previewList = this.entries.value.map((entry: any, index: number) => {
        if (entry.type === 'file' && entry.value instanceof File) {
          // Generate and include Blob URL for the file
          const blobUrl = this.filePreviews[index]?.previewUrl || URL.createObjectURL(entry.value);
          return { fileName: entry.fileName, previewUrl: blobUrl };
        } else if (entry.type === 'url') {
          // Use the URL directly
          return { fileName: entry.fileName, previewUrl: entry.value as string };
        }
        return { fileName: '', previewUrl: '' };
      });
  
      console.log('Form Data:', this.uploadForm.value); // For debugging form data
      console.log('Preview List:', this.previewList);  // For debugging preview list
  
      // Reset the form and previews after submission
      this.entries.clear();
      this.filePreviews = {};
      this.addEntry();
    }
  }
  
  removePreview(index: number): void {
    this.previewList.splice(index, 1); // Remove the selected preview
  }
}
