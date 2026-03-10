/**
 * PQR Feature Types
 */

export interface PqrData {
  id?: number;
  question: string;
  type: "question" | "complaint" | "claim";
  timestamp?: string;
}

export interface PqrState {
  pqrQuestion: string;
  loading: boolean;
  error: string | null;
  submitted: boolean;
}
