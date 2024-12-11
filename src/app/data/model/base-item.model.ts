import { StudyProgram } from "./study-program.model";

export interface BaseItem {
    id: number;
    studyPrograms: StudyProgram[];
    actions: string[];
  }