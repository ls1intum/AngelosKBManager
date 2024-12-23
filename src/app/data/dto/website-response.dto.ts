import { StudyProgramDTO } from "./study-program.dto";

export interface WebsiteResponseDTO {
    id: string;
    title: string;
    link: string;
    lastUpdated: string;
    studyPrograms: StudyProgramDTO[];
  }