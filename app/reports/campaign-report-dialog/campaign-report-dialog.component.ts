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
  selector: 'app-campaign-report-dialog',
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
        <mat-icon class="header-icon">campaign</mat-icon>
        <h2>Generate Campaign Report</h2>
      </div>

      <div class="dialog-content">
        <p class="subtitle">Select date range for the campaign report</p>
        
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
        <button mat-stroked-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
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
    .dialog-container {
      max-width: 400px;
      overflow: hidden;
      border-radius: 8px;
    }

    .dialog-header {
      padding: 24px;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      margin: -24px -24px 24px -24px;
    }

    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .dialog-content {
      padding: 0 0 24px 0;
    }

    .subtitle {
      color: #666;
      margin: 0 0 24px 0;
      font-size: 14px;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 8px;
      border-top: 1px solid #eee;
    }

    .generate-btn {
      color: white;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field {
      line-height: 1.3 !important;
    }
  `]
})
export class CampaignReportDialogComponent {
  reportForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CampaignReportDialogComponent>,
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