import Revision from './Revision';

export default interface NewNote {
  id: string;
  text: string;
  revisions: Revision[];
  versionId: string;
}