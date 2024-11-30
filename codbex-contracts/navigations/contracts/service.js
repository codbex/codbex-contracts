const navigationData = {
    id: 'contracts-navigation',
    label: "Contracts",
    group: "employees",
    order: 1000,
    link: "/services/web/codbex-contracts/gen/codbex-contracts/ui/Contract/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }