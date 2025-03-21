function spoofUsername (name) {
    let wpRequire;
    webpackChunkGUI.push([[Symbol()], {}, function (require) {wpRequire = require}]);
    let vm = wpRequire(Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes("guiInitialState="))]).guiInitialState.vm;
    vm.runtime._primitives.sensing_username = () => name;
    vm.runtime.ioDevices.userData._username = name;
}

["hasCloudPermission", "canModifyCloudData"].forEach(prop => 
    Object.defineProperty(Object.prototype, prop, {
        get: () => true,
        set: () => {},
        enumerable: false
    })
);
