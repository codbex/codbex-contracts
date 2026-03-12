angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-contracts/gen/codbex-contracts/api/EmployeeContracts/EmployeeContractService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete EmployeeContract? This action cannot be undone.',
			deleteTitle: 'Delete EmployeeContract?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.yes');
			translated.no = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.deleteTitle', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
			translated.deleteConfirm = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.deleteConfirm', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-contracts-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'EmployeeContracts' && e.view === 'EmployeeContract' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					response.data.forEach(e => {
						if (e.StartDate) {
							e.StartDate = new Date(e.StartDate);
						}
						if (e.EndDate) {
							e.EndDate = new Date(e.EndDate);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
						message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToLF', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
					message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToCount', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsEmployee: $scope.optionsEmployee,
				optionsCompany: $scope.optionsCompany,
				optionsJobRole: $scope.optionsJobRole,
				optionsType: $scope.optionsType,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.createEntity', data: {
				entity: {},
				optionsEmployee: $scope.optionsEmployee,
				optionsCompany: $scope.optionsCompany,
				optionsJobRole: $scope.optionsJobRole,
				optionsType: $scope.optionsType,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-contracts.EmployeeContracts.EmployeeContract.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsEmployee: $scope.optionsEmployee,
				optionsCompany: $scope.optionsCompany,
				optionsJobRole: $scope.optionsJobRole,
				optionsType: $scope.optionsType,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-contracts.EmployeeContracts.EmployeeContract.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT'),
							message: LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToDelete', { name: '$t(codbex-contracts:codbex-contracts-model.t.EMPLOYEECONTRACT)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'EmployeeContract-filter',
				params: {
					entity: $scope.filterEntity,
					optionsEmployee: $scope.optionsEmployee,
					optionsCompany: $scope.optionsCompany,
					optionsJobRole: $scope.optionsJobRole,
					optionsType: $scope.optionsType,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsEmployee = [];
		$scope.optionsCompany = [];
		$scope.optionsJobRole = [];
		$scope.optionsType = [];


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

		$scope.optionsEmployeeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsEmployee.length; i++) {
				if ($scope.optionsEmployee[i].value === optionKey) {
					return $scope.optionsEmployee[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsJobRoleValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsJobRole.length; i++) {
				if ($scope.optionsJobRole[i].value === optionKey) {
					return $scope.optionsJobRole[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
