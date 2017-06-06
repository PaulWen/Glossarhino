/**
 * Dummy class for uage in controller. Class implements dummy functionality to map departmentId to departmentName
 */
export class DummyResolveDepartment {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor() {

    }

    public resolveDepartment(departmentId: number): String {
        switch (departmentId) {
            case 0: {
                //statements; 
                return "Description";
            }
            case 1: {
                //statements; 
                return "Management";
            }
            case 2: {
                //statements; 
                return "Marketing";
            }
            case 3: {
                //statements;
                return "Production";
            }
            default: {
                //statements;
                return "No department found with id: " + departmentId
            }
        }
    }
}