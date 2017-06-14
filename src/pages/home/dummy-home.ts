/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
import { HomePageInterface } from "./home-interface";

export class DummyHome implements HomePageInterface {
    public getDepartments(): Array<number> {
        let departments: Array<number> = [1, 2, 3];
        return departments;
    };

    public getListings(departmentId?: number): number {
        return 42;
    }

    public getFilter(): Array<boolean> {
        let filter: Array<boolean> = [];
        filter[1] = true;
        filter[2] = false;
        filter[3] = true;

        return filter;
    }

}