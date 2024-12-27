import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface EmployeeContractEntity {
    readonly Id: number;
    Number?: string;
    Employee?: number;
    StartDate?: Date;
    EndDate?: Date;
    Company?: number;
    JobRole?: number;
    Document?: string;
    Type?: number;
    Comment?: string;
}

export interface EmployeeContractCreateEntity {
    readonly Employee?: number;
    readonly StartDate?: Date;
    readonly EndDate?: Date;
    readonly Company?: number;
    readonly JobRole?: number;
    readonly Document?: string;
    readonly Type?: number;
    readonly Comment?: string;
}

export interface EmployeeContractUpdateEntity extends EmployeeContractCreateEntity {
    readonly Id: number;
}

export interface EmployeeContractEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Employee?: number | number[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Company?: number | number[];
            JobRole?: number | number[];
            Document?: string | string[];
            Type?: number | number[];
            Comment?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Employee?: number | number[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Company?: number | number[];
            JobRole?: number | number[];
            Document?: string | string[];
            Type?: number | number[];
            Comment?: string | string[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            JobRole?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            JobRole?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            JobRole?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            JobRole?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            JobRole?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
    },
    $select?: (keyof EmployeeContractEntity)[],
    $sort?: string | (keyof EmployeeContractEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface EmployeeContractEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<EmployeeContractEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface EmployeeContractUpdateEntityEvent extends EmployeeContractEntityEvent {
    readonly previousEntity: EmployeeContractEntity;
}

export class EmployeeContractRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_EMPLOYEECONTRACT",
        properties: [
            {
                name: "Id",
                column: "EMPLOYEECONTRACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "EMPLOYEECONTRACT_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Employee",
                column: "EMPLOYEECONTRACT_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "StartDate",
                column: "EMPLOYEECONTRACT_STARTDATE",
                type: "DATE",
            },
            {
                name: "EndDate",
                column: "EMPLOYEECONTRACT_ENDDATE",
                type: "DATE",
            },
            {
                name: "Company",
                column: "EMPLOYEECONTRACT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "JobRole",
                column: "EMPLOYEECONTRACT_JOBROLE",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "EMPLOYEECONTRACT_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Type",
                column: "EMPLOYEECONTRACT_TYPE",
                type: "INTEGER",
            },
            {
                name: "Comment",
                column: "EMPLOYEECONTRACT_COMMENT",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(EmployeeContractRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeeContractEntityOptions): EmployeeContractEntity[] {
        return this.dao.list(options).map((e: EmployeeContractEntity) => {
            EntityUtils.setDate(e, "StartDate");
            EntityUtils.setDate(e, "EndDate");
            return e;
        });
    }

    public findById(id: number): EmployeeContractEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "StartDate");
        EntityUtils.setDate(entity, "EndDate");
        return entity ?? undefined;
    }

    public create(entity: EmployeeContractCreateEntity): number {
        EntityUtils.setLocalDate(entity, "StartDate");
        EntityUtils.setLocalDate(entity, "EndDate");
        // @ts-ignore
        (entity as EmployeeContractEntity).Number = new NumberGeneratorService().generate(28);
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_EMPLOYEECONTRACT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: EmployeeContractUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "StartDate");
        // EntityUtils.setLocalDate(entity, "EndDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEECONTRACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: EmployeeContractCreateEntity | EmployeeContractUpdateEntity): number {
        const id = (entity as EmployeeContractUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as EmployeeContractUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_EMPLOYEECONTRACT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACT_ID",
                value: id
            }
        });
    }

    public count(options?: EmployeeContractEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEECONTRACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: EmployeeContractEntityEvent | EmployeeContractUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-contracts-EmployeeContracts-EmployeeContract", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-contracts-EmployeeContracts-EmployeeContract").send(JSON.stringify(data));
    }
}
