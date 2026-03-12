angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-contracts/gen/codbex-contracts/api/EmployeeContracts/EmployeeContractService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
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

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.StartDate) {
				params.entity.StartDate = new Date(params.entity.StartDate);
			}
			if (params.entity.EndDate) {
				params.entity.EndDate = new Date(params.entity.EndDate);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsCompany = params.optionsCompany;
			$scope.optionsJobRole = params.optionsJobRole;
			$scope.optionsType = params.optionsType;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToUpdate', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceEmployee = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		
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
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		
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
		$scope.serviceJobRole = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/JobRoleService.ts';
		
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
		$scope.serviceType = '/services/ts/codbex-contracts/gen/codbex-contracts/api/Settings/ContractTypeService.ts';
		
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

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'EmployeeContract-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});