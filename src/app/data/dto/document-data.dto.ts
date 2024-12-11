import { StudyProgramDTO } from "./study-program.dto";

export interface DocumentDataDTO {
    id: number;
    title: string;
    studyPrograms: StudyProgramDTO[];
    createdAt: string;
    updatedAt: string;
}