angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-contracts/gen/codbex-contracts/api/EmployeeContracts/EmployeeContractService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'EmployeeContract successfully created';
		let propertySuccessfullyUpdated = 'EmployeeContract successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'EmployeeContract Details',
			create: 'Create EmployeeContract',
			update: 'Update EmployeeContract'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadSelect', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadUpdate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-contracts-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'EmployeeContracts' && e.view === 'EmployeeContract' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = [];
				$scope.optionsCompany = [];
				$scope.optionsJobRole = [];
				$scope.optionsType = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				if (data.entity.EndDate) {
					data.entity.EndDate = new Date(data.entity.EndDate);
				}
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsJobRole = data.optionsJobRole;
				$scope.optionsType = data.optionsType;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsJobRole = data.optionsJobRole;
				$scope.optionsType = data.optionsType;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				if (data.entity.EndDate) {
					data.entity.EndDate = new Date(data.entity.EndDate);
				}
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsJobRole = data.optionsJobRole;
				$scope.optionsType = data.optionsType;
				$scope.action = 'update';
			});
		}});

		$scope.serviceEmployee = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		$scope.serviceJobRole = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/JobRoleService.ts';
		$scope.serviceType = '/services/ts/codbex-contracts/gen/codbex-contracts/api/Settings/ContractTypeService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createEmployee = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCompany = () => {
			Dialogs.showWindow({
				id: 'Company-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createJobRole = () => {
			Dialogs.showWindow({
				id: 'JobRole-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createType = () => {
			Dialogs.showWindow({
				id: 'ContractType-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshEmployee = () => {
			$scope.optionsEmployee = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
				$scope.optionsEmployee = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Employee',
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCompany = () => {
			$scope.optionsCompany = [];
			$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts').then((response) => {
				$scope.optionsCompany = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Company',
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshJobRole = () => {
			$scope.optionsJobRole = [];
			$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/JobRoleService.ts').then((response) => {
				$scope.optionsJobRole = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'JobRole',
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshType = () => {
			$scope.optionsType = [];
			$http.get('/services/ts/codbex-contracts/gen/codbex-contracts/api/Settings/ContractTypeService.ts').then((response) => {
				$scope.optionsType = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Type',
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});