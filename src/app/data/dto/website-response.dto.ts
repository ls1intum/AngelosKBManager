import { StudyProgramDTO } from "./study-program.dto";

export interface WebsiteResponseDTO {
    id: number;
    title: string;
    link: string;
    lastUpdated: string;
    studyPrograms: StudyProgramDTO[];
  }