import avatar from "../assets/img/avatar.jpg";
import Cover1 from "../assets/img/cover1.jpg";
import Cover2 from "../assets/img/cover2.jpg";
import Cover3 from "../assets/img/cover3.jpg";
import Cover4 from "../assets/img/cover4.jpg";
import Cover5 from "../assets/img/cover5.jpg";
import Cover6 from "../assets/img/cover6.jpg";
import Cover7 from "../assets/img/cover7.jpg";
import Cover8 from "../assets/img/cover8.jpg";
import Cover9 from "../assets/img/cover9.jpg";

export type Message = {
  status?: string;
  message?: string;
  data?: any;
};

export interface User {
  email: string;
  photoURL?: string;
}
export type LabelColors = {
  backgroundColor: string;
  fontColor: string;
};

export type Label = {
  content: string;
} & LabelColors;

export const LABEL_COLORS: LabelColors[] = [
  { backgroundColor: "bg-gray-400", fontColor: "text-gray-600" },
  { backgroundColor: "bg-green-400", fontColor: "text-green-600" },
  { backgroundColor: "bg-blue-400", fontColor: "text-blue-600" },
  { backgroundColor: "bg-red-400", fontColor: "text-red-600" },
  { backgroundColor: "bg-yellow-400", fontColor: "text-yellow-600" },
  { backgroundColor: "bg-purple-400", fontColor: "text-purple-600" },
  { backgroundColor: "bg-pink-400", fontColor: "text-pink-600" },
  { backgroundColor: "bg-indigo-400", fontColor: "text-indigo-600" },
  { backgroundColor: "bg-black", fontColor: "text-white" },
];
export const TASK_COVER = {
  cover1: Cover1,
  cover2: Cover2,
  cover3: Cover3,
  cover4: Cover4,
  cover5: Cover5,
  cover6: Cover6,
  cover7: Cover7,
  cover8: Cover8,
  cover9: Cover9,
};

export interface Board {
  title: string;
  _id: string;
  coverURL?: string;
  members?: User[];
  visibility: Boolean;
  owner?: string | undefined;
  createdDate?: Date;
  description: string;
  lists?: List[];
}

export interface List {
  _id?: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  _id?: string;
  title: string;
  tags?: Label[];
  comments?: CommentType[];
  members?: User[];
  coverURL?: string;
  description?: string;
  files?: [];
  source?: string;
}

export interface CommentType {
  _id?: string;
  author: User;
  content: string;
  createdDate?: Date;
}

export interface StateTypes {
  user: User;
  boards: Board[];
  users: User[];
  lists: List[];
  task: Task;
}

export const AUTHENTICATE_USER = "AUTHENTICATE_USER";
export const GET_BOARDS_BY_USER = "GET_BOARDS_BY_USER";
export const UPDATE_BOARDS = "UPDATE_BOARDS";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_USERS = "UPDATE_USERS";
export const UPDATE_LISTS = "UPDATE_LISTS";
export const ADD_TO_LISTS = "ADD_TO_LISTS";
export const AUTH_TOKEN = "AUTH_TOKEN";
export const CURRENT_USER = "CURRENT_USER";
export const UPDATE_CURRENT_TASK = "UPDATE_CURRENT_TASK";

export const MAXIMUM_MEMBERS_DISPLAYED_PER_CARD = 3;
export const MAXIMUM_MEMBERS_DISPLAYED_PER_BOARD = 2;
export const MAXIMUM_MEMBERS_DISPLAYED_PER_TASK = 1;
export const DEFAULT_AVATAR = avatar;
export const DEFAULT_BOARD_COVER =
  "https://images.unsplash.com/photo-1486520299386-6d106b22014b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1ZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
export const DEFAULT_TASK_COVER =
  "https://images.unsplash.com/photo-1539678955859-9f368343753f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8N3x8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=60";
interface AuthenticateAction {
  type: typeof AUTHENTICATE_USER;
  payload: User;
}

interface GetBoardsByUser {
  type: typeof GET_BOARDS_BY_USER;
  payload: User;
}

interface UpdateBoards {
  type: typeof UPDATE_BOARDS;
  payload: Board[];
}

interface AddBoard {
  type: typeof ADD_BOARD;
  payload: Board;
}

interface UpdateUsers {
  type: typeof UPDATE_USERS;
  payload: User[];
}

interface UpdateLists {
  type: typeof UPDATE_LISTS;
  payload: List[];
}

interface AddToLists {
  type: typeof ADD_TO_LISTS;
  payload: List;
}

interface UpdateCurrentTask {
  type: typeof UPDATE_CURRENT_TASK;
  payload: Task;
}

export type ActionTypes =
  | AuthenticateAction
  | GetBoardsByUser
  | UpdateBoards
  | AddBoard
  | UpdateUsers
  | UpdateLists
  | UpdateCurrentTask
  | AddToLists;
