export interface Commit {
  _id?: string;
  project: string;
  lifecycle: string;
  action: string;
  type: string;
  description?: string;
  header: string;
  createdAt?: string;
  updatedAt?: string;
}
