import { StudyProgramDTO } from "./study-program.dto";

export interface DocumentDataDTO {
    id: string;
    title: string;
    studyPrograms: StudyProgramDTO[];
    createdAt: string;
    updatedAt: string;
}