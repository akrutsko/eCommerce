export interface Member {
  name: string;
  img: string;
  text: string | Bio;
}

interface Bio {
  bio: string;
  hobby: string;
  ultimate: string;
}
