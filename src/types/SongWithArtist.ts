import Version from '@/types/Version'

export default interface SongWithArtist {
  id: string;
  title: string;
  isOpen: boolean;
  created_at: string;
  updated_at: string;
  triggerUpdate: string;
  artistId: string;
  versions: Version[];
  artistName: string;
  artistImage: string;
}