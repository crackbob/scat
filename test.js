let findSprite = (name) => vm.runtime.targets.find(target => target.sprite.name == name);
let findVariable = (sprite, name) => Object.values(sprite.variables).find(variable => variable.name == name);

function getUncompiledSpriteProcedures (name) {
    let targetSprite = findSprite(name);
    let spriteBlocks = targetSprite.blocks._blocks;
    return Object.keys(spriteBlocks).filter(key => spriteBlocks[key].topLevel).reduce((acc, blockKey) => {
        let compileResult = targetSprite.blocks.getCachedCompileResult(blockKey);
        if (compileResult !== null) {
            acc[blockKey] = compileResult.value.procedures;
        }
        return acc;
    }, {});  
}

function hookProcedureThread (spriteName, procedureName) {
    let cachedProcedures = Object.values(getUncompiledSpriteProcedures(spriteName)).find(obj => obj[procedureName]);
    let originalFn = cachedProcedures[procedureName];

    let hook = {};
    cachedProcedures[procedureName] = function (thread) {
        hook.thread = thread;
        hook.procedures = thread.procedures;
        return originalFn.apply(this, arguments);
    }
    return hook;
}
