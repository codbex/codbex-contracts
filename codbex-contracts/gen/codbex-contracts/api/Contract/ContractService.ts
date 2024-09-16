import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { ContractRepository, ContractEntityOptions } from "../../dao/Contract/ContractRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

const validationModules = await Extensions.loadExtensionModules("codbex-contracts-Contract-Contract", ["validate"]);

@Controller
class ContractService {

    private readonly repository = new ContractRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: ContractEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-contracts/gen/codbex-contracts/api/Contract/ContractService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("Contract not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("Contract not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Number?.length > 20) {
            throw new ValidationError(`The 'Number' exceeds the maximum length of [20] characters`);
        }
        if (entity.StartDate === null || entity.StartDate === undefined) {
            throw new ValidationError(`The 'StartDate' property is required, provide a valid value`);
        }
        if (entity.EndDate === null || entity.EndDate === undefined) {
            throw new ValidationError(`The 'EndDate' property is required, provide a valid value`);
        }
        if (entity.Company === null || entity.Company === undefined) {
            throw new ValidationError(`The 'Company' property is required, provide a valid value`);
        }
        if (entity.JobRole === null || entity.JobRole === undefined) {
            throw new ValidationError(`The 'JobRole' property is required, provide a valid value`);
        }
        if (entity.Url === null || entity.Url === undefined) {
            throw new ValidationError(`The 'Url' property is required, provide a valid value`);
        }
        if (entity.Url?.length > 500) {
            throw new ValidationError(`The 'Url' exceeds the maximum length of [500] characters`);
        }
        if (entity.Comment?.length > 1000) {
            throw new ValidationError(`The 'Comment' exceeds the maximum length of [1000] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
