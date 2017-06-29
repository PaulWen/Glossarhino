import { UserDataObject } from "../../providers/dataobjects/user.dataobject";

export interface CommentModalModelInterface {
    getCurrentUser(): UserDataObject;
}