export interface User {
    id: number;
    mail: string;
    isApproved: boolean;
    isAdmin: boolean;
    actions: string[];
  }