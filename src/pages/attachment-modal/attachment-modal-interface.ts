import { Attachment } from "../../providers/model/attachment-model";

/**
 * Interface to define what the page Attachment Modal needs implemented in order to work
 */
export interface AttachmentModalInterface {
    getAttachments: (entryId: number, departmentName: String) => Array<Attachment>;
}