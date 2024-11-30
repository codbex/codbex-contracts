const navigationData = {
    id: 'employee-contracts-navigation',
    label: "Employee Contracts",
    group: "employees",
    order: 1000,
    link: "/services/web/codbex-contracts/gen/codbex-contracts/ui/EmployeeContracts/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }