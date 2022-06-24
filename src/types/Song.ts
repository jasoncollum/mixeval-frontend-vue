import Version from '@/types/Version'

export default interface Song {
  id: string;
  title: string;
  isOpen: boolean;
  created_at: string;
  updated_at: string;
  triggerUpdate: string;
  versions: Version[];
}