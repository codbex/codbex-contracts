const navigationData = {
    id: 'employee-contracts-navigation',
    label: "Employee Contracts",
    view: "contracts assignments",
    group: "employees",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-contracts/gen/codbex-contracts/ui/EmployeeContracts/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }