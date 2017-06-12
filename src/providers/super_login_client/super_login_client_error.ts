/**
 * The class describes the error(s) of an SuperLogin request.
 */
export class SuperLoginClientError {

/////////////////////////////////////////////Constants/////////////////////////////////////////////

    public static get UNAUTHORIZED(): string {return "Unauthorized";};

    public static get AUTH_ERR_1(): string {return "Email already in use";};
    public static get AUTH_ERR_2(): string {return "Password must be at least 6 characters";};
    public static get AUTH_ERR_3(): string {return "Email can't be blank";};
    public static get AUTH_ERR_4(): string {return "Password can't be blank";};
    public static get AUTH_ERR_5(): string {return "Name can't be blank";};
    public static get AUTH_ERR_6(): string {return "Email invalid email";};

    public static get LOGIN_ERR_1(): string {return "Invalid username or password";};
    public static get LOGIN_ERR_2(): string {return "Missing credentials";};

////////////////////////////////////////////Properties////////////////////////////////////////////

    /** this property contains the complete error message from the SuperLogin server */
    private errorMessage: string;

////////////////////////////////////////////Constructor////////////////////////////////////////////

    /**
     * The constructor of SuperLoginClientError.
     *
     * @param error JSON-object which represents the error from the SuperLogin server
     */
    constructor(error: any) {
        Error.apply(this, arguments);
        this.errorMessage = error._body;
    }

/////////////////////////////////////////Getter & Setter///////////////////////////////////////////

    /**
     * Returns the error message of the SuperLogin server.
     * 
     * @returns {string}
     */
    public getErrorMessage(): string {
        return this.errorMessage;
    }

/////////////////////////////////////////////Methods///////////////////////////////////////////////

    /**
     * The function checks if this error lists a specific error.
     *
     * @param error
     * @returns {boolean}
     */
    public checkForError(error: string): boolean {
        return (this.errorMessage).indexOf(error) > -1;
    }
}