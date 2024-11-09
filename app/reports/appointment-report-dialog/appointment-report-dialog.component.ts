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
  selector: 'app-appointment-report-dialog',
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
        <mat-icon class="header-icon">event_available</mat-icon>
        <h2>Generate Appointment Report</h2>
      </div>

      <form [formGroup]="reportForm" (ngSubmit)="onGenerate()">
        <div class="dialog-content">
          <mat-form-field appearance="fill">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!reportForm.valid">
            Generate Report
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding-bottom: 16px;
    }
    .dialog-header {
      margin: -24px -24px 24px -24px;
      padding: 16px;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
    .header-icon {
      margin-right: 8px;
    }
  `]
})
export class AppointmentReportDialogComponent {
  reportForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AppointmentReportDialogComponent>,
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