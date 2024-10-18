const navigationData = {
    id: 'contracts-navigation',
    label: "Contracts",
    view: "contracts assignments",
    group: "employees",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-contracts/gen/codbex-contracts/ui/Contract/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }