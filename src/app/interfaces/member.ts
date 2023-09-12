export interface Member {
  name: string;
  img: string;
  text: string | Bio;
  github?: string;
}

interface Bio {
  bio: string;
  hobby: string;
  ultimate: string;
}
