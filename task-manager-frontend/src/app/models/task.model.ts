export type TaskCategory = 'TRAVAIL' | 'PERSONNEL' | 'URGENT' | 'AUTRE';

export interface Task {
  id?: number;
  titre: string;
  description: string;
  termine: boolean;
  category: TaskCategory;
  dateEcheance?: string;
}