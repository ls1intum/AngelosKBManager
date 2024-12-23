import { StudyProgram } from "./study-program.model";

export interface BaseItem {
    id: string;
    studyPrograms: StudyProgram[];
    actions: string[];
  }