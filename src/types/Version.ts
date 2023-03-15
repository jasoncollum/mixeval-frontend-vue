import Note from '@/types/Note'

export default interface Version {
  id: string;
  number: number;
  audioFileName: string;
  created_at: string;
  updated_at: string;
  triggerUpdate: string;
  songId: string;
  notes: Note[];
}