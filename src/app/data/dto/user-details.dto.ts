export interface UserDetailsDTO {
  id: number;
  mail: string;
  isAdmin: boolean;
  isSystemAdmin: boolean;
  isApproved: boolean;
  organisationName: string;
  organisationActive: boolean;
}
