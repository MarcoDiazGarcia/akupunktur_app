import type { Record } from "pocketbase";
import { writable, type Writable } from "svelte/store";

export const dialogIsOpened: Writable<boolean> = writable(false);

export const editTreatmentDialogIsOpened: Writable<boolean> = writable(false);
export let treatmentToBeEdited: Record;
export let pointsToBeEdited: Record[];

export const dialogConfirmationIsOpened: Writable<boolean> = writable(false);
let action: Function;

const toggle = (b: boolean) => !b;

export function toggleDialog() {
    dialogIsOpened.update(toggle);
}

export function openEditTreatmentDialog(treatment: Record, points: Record[]) {
    treatmentToBeEdited = treatment;
    pointsToBeEdited = points;
    editTreatmentDialogIsOpened.update(toggle);
}

export function closeEditTreatmentDialog() {
    editTreatmentDialogIsOpened.update(toggle);
}

export function openConfirmationDialog(callback: Function) {
    action = callback;
    dialogConfirmationIsOpened.update(toggle);
}

export function closeConfirmationDialog(confirmed: boolean) {
    if (confirmed) {
        action();
    }
    dialogConfirmationIsOpened.update(toggle);
}
