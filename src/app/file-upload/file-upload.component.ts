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
  filePreviews: { [key: number]: string | null } = {};

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      entries: this.fb.array([this.createEntry()]), // Initialize with one entry
    });
  }

  ngOnInit() {
    // No need to call addEntry() here
  }

  // Getter for form array
  get entries(): FormArray {
    return this.uploadForm.get('entries') as FormArray;
  }

  // Create a form group for each entry
  createEntry(): FormGroup {
    return this.fb.group({
      fileName: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['file', Validators.required], // Default to 'file'
      value: [null, Validators.required],
    });
  }

  // Add a new entry
  addEntry(): void {
    this.entries.push(this.createEntry());
  }

  // Remove an entry
  removeEntry(index: number): void {
    this.entries.removeAt(index);
    delete this.filePreviews[index]; // Clear preview
  }

  // Handle file selection
  onFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;
    if (file) {
      this.entries.at(index).get('value')?.setValue(file);
      this.filePreviews[index] = file.name; // Save file name for preview
    }
  }

  // Submit form
  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      const entriesData: FileEntry[] = this.entries.value.map(
        (entry: FileEntry, index: number) => {
          if (entry.type === 'file') {
            if (entry.value instanceof File) {
              const blobUrl = URL.createObjectURL(entry.value);
              formData.append(`file${index}`, blobUrl);
              return { ...entry, value: blobUrl };
            }
          } else if (entry.type === 'url') {
            formData.append(`url${index}`, entry.value);
            return entry;
          }
          return entry;
        }
      );

      console.log('Entries Data:', entriesData);
      console.log('FormData for files:', Array.from(formData.entries()));
    }
  }
}
