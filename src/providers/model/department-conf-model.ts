/**
 * Department Config class for uage in model and controller. Class specifies department config
 */
export class DepartmentConfig {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private id: number;
    private name: String;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor(id: number, name: String) {
        this.id = id;
        this.name = name;
    }
}