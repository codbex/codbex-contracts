angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-contracts.EmployeeContracts.EmployeeContract';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-contracts/gen/codbex-contracts/api/EmployeeContracts/EmployeeContractService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "EmployeeContract Details",
			create: "Create EmployeeContract",
			update: "Update EmployeeContract"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-contracts-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "EmployeeContracts" && e.view === "EmployeeContract" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsEmployee = [];
				$scope.optionsCompany = [];
				$scope.optionsJobRole = [];
				$scope.optionsType = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.StartDate) {
					msg.data.entity.StartDate = new Date(msg.data.entity.StartDate);
				}
				if (msg.data.entity.EndDate) {
					msg.data.entity.EndDate = new Date(msg.data.entity.EndDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsJobRole = msg.data.optionsJobRole;
				$scope.optionsType = msg.data.optionsType;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsJobRole = msg.data.optionsJobRole;
				$scope.optionsType = msg.data.optionsType;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.StartDate) {
					msg.data.entity.StartDate = new Date(msg.data.entity.StartDate);
				}
				if (msg.data.entity.EndDate) {
					msg.data.entity.EndDate = new Date(msg.data.entity.EndDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsJobRole = msg.data.optionsJobRole;
				$scope.optionsType = msg.data.optionsType;
				$scope.action = 'update';
			});
		});

		$scope.serviceEmployee = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		$scope.serviceJobRole = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/JobRoleService.ts";
		$scope.serviceType = "/services/ts/codbex-contracts/gen/codbex-contracts/api/Settings/ContractTypeService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("EmployeeContract", `Unable to create EmployeeContract: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("EmployeeContract", "EmployeeContract successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("EmployeeContract", `Unable to update EmployeeContract: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("EmployeeContract", "EmployeeContract successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);