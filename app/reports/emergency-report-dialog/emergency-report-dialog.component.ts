import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-emergency-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header" [style.background-color]="data.color">
        <mat-icon class="header-icon">emergency</mat-icon>
        <h2>Generate Emergency Report</h2>
      </div>

      <div class="dialog-content">
        <p class="subtitle">Select date range for the emergency report</p>
        
        <form [formGroup]="reportForm" class="form-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate" placeholder="Choose a date">
            <mat-datepicker-toggle matSuffix [for]="startPicker">
              <mat-icon matDatepickerToggleIcon>event</mat-icon>
            </mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error *ngIf="reportForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" placeholder="Choose a date">
            <mat-datepicker-toggle matSuffix [for]="endPicker">
              <mat-icon matDatepickerToggleIcon>event</mat-icon>
            </mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
            <mat-error *ngIf="reportForm.get('endDate')?.hasError('required')">
              End date is required
            </mat-error>
          </mat-form-field>
        </form>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-flat-button 
                [style.background-color]="data.color"
                class="generate-btn"
                (click)="onGenerate()"
                [disabled]="!reportForm.valid">
          <mat-icon>description</mat-icon>
          Generate Report
        </button>
      </div>
    </div>
  `,
  styles: [`
    // ... same styles as campaign dialog ...
  `]
})
export class EmergencyReportDialogComponent {
  reportForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EmergencyReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onGenerate(): void {
    if (this.reportForm.valid) {
      this.dialogRef.close(this.reportForm.value);
    }
  }
}  