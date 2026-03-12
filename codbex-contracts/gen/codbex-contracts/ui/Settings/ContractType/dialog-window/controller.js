angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-contracts/gen/codbex-contracts/api/Settings/ContractTypeService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'ContractType successfully created';
		let propertySuccessfullyUpdated = 'ContractType successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'ContractType Details',
			create: 'Create ContractType',
			update: 'Update ContractType'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadSelect', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-contracts:codbex-contracts-model.defaults.formHeadUpdate', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.Settings.ContractType.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToCreate', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-contracts.Settings.ContractType.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-contracts:codbex-contracts-model.messages.error.unableToUpdate', { name: '$t(codbex-contracts:codbex-contracts-model.t.CONTRACTTYPE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'ContractType-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});