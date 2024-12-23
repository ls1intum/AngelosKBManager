import { StudyProgramDTO } from "./study-program.dto";

export interface SampleQuestionDTO {
    id: string;
    topic: string;
    question: string;
    answer: string;
    studyPrograms: StudyProgramDTO[];
}
  