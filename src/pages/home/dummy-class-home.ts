// Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation

import { HomePageInterface } from "./home";

export class DummyHome implements HomePageInterface {
    private departments: Array<String> = ["Marketing", "Production", "Management"];

    public getDepartments(): Array<String> {
        return this.departments;
    }

}