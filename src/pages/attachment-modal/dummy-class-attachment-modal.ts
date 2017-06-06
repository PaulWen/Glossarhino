import { Attachment } from "../../providers/model/attachment-model";
import { AttachmentModalInterface } from "./attachment-modal-interface";

/**
 * This is a dummy class for testing purposes. Will implement the AttachmentModalInterface
 */
export class DummyAttachmentModal implements AttachmentModalInterface{
    // Array to save example attachments
    private attachments: Array<Attachment> = [new Attachment("Test Attachment", new URL("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/FuBK_testcard_vectorized.svg/768px-FuBK_testcard_vectorized.svg.png")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))];

    public getAttachments(): Array<Attachment> {
        return this.attachments
    }
}