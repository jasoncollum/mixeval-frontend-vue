import Revision from '@/types/Revision'

export default interface Note {
  id: string;
  text: string;
  created_at: string;
  updated_at: string;
  versionId: string;
  revisions: Revision[];
}