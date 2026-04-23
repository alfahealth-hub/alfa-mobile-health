# Plan: Add Gender and Laboratory Tests to Patient Records

Add a 'Gender' selection and a 'Laboratory Tests' textarea to the patient clinical entry form. Ensure this data is saved to the patient profile and displayed in their clinical history.

## 1. Type Updates (src/types/index.ts)
- `PatientRecord` interface: Add `gender?: string;` and `laboratoryTests?: string;`
- (Note: `Patient` interface already has `gender?: string;`)

## 2. Component Updates

### src/components/RecordForm.tsx
- Update `formData` state to include `gender` and `laboratoryTests`.
- Update `handleAppointmentSelect` and `handlePatientSelect` to populate `gender` from the selected patient.
- Update `handleSubmit` to include `gender` in the `patientUpdate` object.
- UI Changes:
    - Add "Gender" select input in the "Patient Identification" section next to Age.
    - Add "Laboratory Tests" textarea section in the right column or as a new full-width section.

### src/components/PatientFile.tsx
- UI Changes:
    - Display "Gender" in the "Personal Info" card (left column).
    - Display "Laboratory Tests" in the clinical history timeline cards (right column) if they exist.

## 3. Data Flow (src/App.tsx)
- The existing `handleAddRecord` logic already supports updating patient details via `patientUpdate`. I will ensure `gender` is included in this update so it persists on the patient profile.

## 4. Verification
- Verify that Gender and Lab Tests are saved to local storage.
- Verify that Gender appears in the Patient File personal info.
- Verify that Lab Tests appear in the clinical history timeline.
- Ensure no existing data is lost.
