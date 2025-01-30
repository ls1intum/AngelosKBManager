import { Component } from "@angular/core";
import { AddButtonComponent } from "../../../layout/buttons/add-button/add-button.component";
import { MainTableComponent } from "../../../layout/tables/main-table/main-table.component";
import { OrganisationDialogComponent } from "./dialog/organisation-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OrganisationService } from "@app/services/organisation.service";
import { Organisation } from "@app/data/model/organisation.model";
import { SimpleTableComponent } from "@app/layout/tables/simple-table/simple-table.component";


@Component({
    selector: 'organisation-table',
    standalone: true,
    imports: [
        AddButtonComponent,
        SimpleTableComponent
    ],
    templateUrl: './organisation.component.html',
    styleUrls: [
        './organisation.component.css',
        '../../../layout/dialogs/dialog-styles.css'
    ]
})
export class OrganisationComponent {

    loading: boolean;
    organisations: Organisation[] = [];
    tableHeaders: { [key: string]: string } = {
        id: 'ID',
        name: 'Organisation Name',
    };
    displayedColumns: string[] = ['id', 'name'];

    constructor(
        private dialog: MatDialog,
        private organisationService: OrganisationService
    ) {
        this.loading = false;
    }

    ngOnInit() {
        this.organisationService.getOrganisations().subscribe({
            next: (orgs) => this.organisations = orgs,
            error: (err) => this.organisations = []
        });
    }
    protected addOrganisation() {
        this.dialog.open(OrganisationDialogComponent, {
            data: { name: '' }
        });
    }

    protected editOrganisation(org: Organisation) {
        this.dialog.open(OrganisationDialogComponent, {
            data: { name: org.name, id: org.id }
        });
    }
}