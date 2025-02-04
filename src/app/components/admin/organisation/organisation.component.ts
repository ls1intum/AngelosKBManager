import { Component } from "@angular/core";
import { AddButtonComponent } from "../../../layout/buttons/add-button/add-button.component";
import { OrganisationDialogComponent } from "./dialog/organisation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Organisation } from "@app/data/model/organisation.model";
import { SimpleTableComponent } from "@app/layout/tables/simple-table/simple-table.component";
import { OrganisationService } from "@app/services/organisation.service";


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
    ],
    providers: [OrganisationService]

})
export class OrganisationComponent {

    protected loading: boolean = false;
    organisations: Organisation[] = [];
    tableHeaders: { [key: string]: string } = {
        id: 'ID',
        name: 'Organisation Name',
    };
    displayedColumns: string[] = ['id', 'name'];

    constructor(private dialog: MatDialog, private organisationService: OrganisationService) { }

    ngOnInit() {
        this.organisationService.getOrganisations().subscribe({
            next: (orgs) => this.organisations = orgs,
            error: (err) => this.organisations = []
        });
    }

    protected addOrganisation() {
        this.dialog.open(OrganisationDialogComponent, {
            data: { name: '' }
        }).afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    this.organisations = [...this.organisations, result];
                }
            },
            error: (err) => {
                console.error('Error adding organisation:', err);
            }
        });

    }

    protected updateOrganisation(org: Organisation) {
        this.dialog.open(OrganisationDialogComponent, {
            data: { name: org.name, id: org.id }
        }).afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    this.organisations = this.organisations.map(org =>
                        org.id === result.id ? result : org
                    );
                }
            },
            error: (err) => {
                console.error('Error editing organisation:', err);
            }
        });;
    }
}