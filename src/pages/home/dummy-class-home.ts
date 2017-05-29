/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
import { HomePageInterface } from "./home-interface";

export class DummyHome implements HomePageInterface {
    private departments: Array<String> = ["Management", "Marketing", "Production"];

    public getDepartments(): Array<String> {
        return this.departments;
    };

    public getListings(department: String) {
        return 42;
    }

}