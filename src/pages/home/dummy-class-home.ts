/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
import { HomePageInterface } from "./home-interface";

export class DummyHome implements HomePageInterface {
    private departments: Array<number> = [1, 2, 3];

    public getDepartments(): Array<number> {
        return this.departments;
    };

    public getListings(departmentId: number): number {
        return 42;
    }

}