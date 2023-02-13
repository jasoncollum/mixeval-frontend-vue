export default interface Revision {
  id: string;
  text: string;
  created_at?: string;
  updated_at?: string;
  noteId: string;
}