import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface EmployeeContractItemEntity {
    readonly Id: number;
    Name?: string;
    Document?: string;
    EmployeeContract?: number;
}

export interface EmployeeContractItemCreateEntity {
    readonly Name?: string;
    readonly Document?: string;
    readonly EmployeeContract?: number;
}

export interface EmployeeContractItemUpdateEntity extends EmployeeContractItemCreateEntity {
    readonly Id: number;
}

export interface EmployeeContractItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Document?: string | string[];
            EmployeeContract?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Document?: string | string[];
            EmployeeContract?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Document?: string;
            EmployeeContract?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Document?: string;
            EmployeeContract?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Document?: string;
            EmployeeContract?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Document?: string;
            EmployeeContract?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Document?: string;
            EmployeeContract?: number;
        };
    },
    $select?: (keyof EmployeeContractItemEntity)[],
    $sort?: string | (keyof EmployeeContractItemEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface EmployeeContractItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<EmployeeContractItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface EmployeeContractItemUpdateEntityEvent extends EmployeeContractItemEntityEvent {
    readonly previousEntity: EmployeeContractItemEntity;
}

export class EmployeeContractItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_EMPLOYEECONTRACTITEM",
        properties: [
            {
                name: "Id",
                column: "EMPLOYEECONTRACTITEM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "EMPLOYEECONTRACTITEM_NAME",
                type: "VARCHAR",
            },
            {
                name: "Document",
                column: "EMPLOYEECONTRACTITEM_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "EmployeeContract",
                column: "EMPLOYEECONTRACTITEM_EMPLOYEECONTRACT",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(EmployeeContractItemRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeeContractItemEntityOptions): EmployeeContractItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): EmployeeContractItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: EmployeeContractItemCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_EMPLOYEECONTRACTITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACTITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: EmployeeContractItemUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEECONTRACTITEM",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACTITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: EmployeeContractItemCreateEntity | EmployeeContractItemUpdateEntity): number {
        const id = (entity as EmployeeContractItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as EmployeeContractItemUpdateEntity);
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
            table: "CODBEX_EMPLOYEECONTRACTITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEECONTRACTITEM_ID",
                value: id
            }
        });
    }

    public count(options?: EmployeeContractItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEECONTRACTITEM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: EmployeeContractItemEntityEvent | EmployeeContractItemUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-contracts-EmployeeContracts-EmployeeContractItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-contracts-EmployeeContracts-EmployeeContractItem").send(JSON.stringify(data));
    }
}
