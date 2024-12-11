import { StudyProgramDTO } from "./study-program.dto";

export interface SampleQuestionDTO {
    id: number;
    topic: string;
    question: string;
    answer: string;
    studyPrograms: StudyProgramDTO[];
}
  