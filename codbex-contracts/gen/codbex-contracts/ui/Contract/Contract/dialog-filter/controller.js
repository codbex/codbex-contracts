angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.StartDateFrom) {
			params.entity.StartDateFrom = new Date(params.entity.StartDateFrom);
		}
		if (params?.entity?.StartDateTo) {
			params.entity.StartDateTo = new Date(params.entity.StartDateTo);
		}
		if (params?.entity?.EndDateFrom) {
			params.entity.EndDateFrom = new Date(params.entity.EndDateFrom);
		}
		if (params?.entity?.EndDateTo) {
			params.entity.EndDateTo = new Date(params.entity.EndDateTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsCompany = params.optionsCompany;
		$scope.optionsType = params.optionsType;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.Number) {
			filter.$filter.contains.Number = entity.Number;
		}
		if (entity.StartDateFrom) {
			filter.$filter.greaterThanOrEqual.StartDate = entity.StartDateFrom;
		}
		if (entity.StartDateTo) {
			filter.$filter.lessThanOrEqual.StartDate = entity.StartDateTo;
		}
		if (entity.EndDateFrom) {
			filter.$filter.greaterThanOrEqual.EndDate = entity.EndDateFrom;
		}
		if (entity.EndDateTo) {
			filter.$filter.lessThanOrEqual.EndDate = entity.EndDateTo;
		}
		if (entity.Company !== undefined) {
			filter.$filter.equals.Company = entity.Company;
		}
		if (entity.Document) {
			filter.$filter.contains.Document = entity.Document;
		}
		if (entity.Type !== undefined) {
			filter.$filter.equals.Type = entity.Type;
		}
		if (entity.Comment) {
			filter.$filter.contains.Comment = entity.Comment;
		}
		Dialogs.postMessage({ topic: 'codbex-contracts.Contract.Contract.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-contracts.Contract.Contract.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Contract-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});