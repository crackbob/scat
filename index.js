const windowDiv = document.createElement('div');
windowDiv.style.width = '250px';
windowDiv.style.height = '200px';
windowDiv.style.backgroundColor = '#202124';
windowDiv.style.border = 'rgb(77, 77, 77) solid 1px';
windowDiv.style.position = 'fixed';
windowDiv.style.bottom = '20px';
windowDiv.style.right = '20px';
windowDiv.style.boxShadow = 'rgba(0, 0, 0, 0.45) 0px 0px 10px 0px';
windowDiv.style.zIndex = '999999';
windowDiv.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
windowDiv.style.overflow = 'hidden';

const titleBar = document.createElement('div');
titleBar.style.backgroundColor = 'rgb(45, 45, 48)';
titleBar.style.color = 'white';
titleBar.style.height = '32px';
titleBar.style.cursor = 'move';
titleBar.style.userSelect = 'none';
titleBar.style.display = 'flex';
titleBar.style.alignItems = 'center';
titleBar.style.paddingLeft = '10px';
titleBar.style.borderBottom = '1px solid rgb(43, 43, 43)';
titleBar.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 1px 3px';

const titleText = document.createElement('div');
titleText.innerText = 'Scat';
titleText.style.fontSize = '15px';
titleText.style.textShadow = 'rgba(0, 0, 0, 0.5) 0px 1px 1px';
titleText.style.margin = '0px 1px 2px 0px';

titleBar.appendChild(titleText);
windowDiv.appendChild(titleBar);

const contentArea = document.createElement('div');
contentArea.style.padding = '15px';
contentArea.style.display = 'flex';
contentArea.style.flexDirection = 'column'; 
contentArea.style.gap = '10px'; 
windowDiv.appendChild(contentArea);

function createButton(text, callback) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.backgroundColor = '#4A4A4A';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.padding = '8px 12px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.flexGrow = '1';
    button.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

    button.onmouseenter = () => {
        button.style.backgroundColor = '#575757';
        button.style.borderColor = '#888';
    };

    button.onmouseleave = () => {
        button.style.backgroundColor = '#4A4A4A';
        button.style.borderColor = '#666';
    };

    button.onclick = callback;

    return button;
}

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';
buttonContainer.style.width = '100%';
buttonContainer.style.flexDirection = 'column-reverse'; 
contentArea.appendChild(buttonContainer);

function getVM () {
   return app._reactRootContainer._internalRoot.current.child.stateNode.store.getState().scratchGui.vm;
}

buttonContainer.appendChild(createButton('Inject Sprite', () => {
    let vm = getVM();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    
    fileInput.onchange = function(event) {
        Array.from(event.target.files).forEach((file) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                vm.addSprite(reader.result);
            }
        });
    }
    
    fileInput.click();
}));

buttonContainer.appendChild(createButton('Force Enable Cloud', () => {
    ["hasCloudPermission", "canModifyCloudData"].forEach(prop => {
        Object.defineProperty(Object.prototype, prop, {
            get: () => true,
            set: () => {},
            enumerable: false
        })
    });
}));

buttonContainer.appendChild(createButton('Spoof Username', () => {
    let vm = getVM();
    let name = prompt("name?");
    vm.runtime._primitives.sensing_username = () => name;
    vm.runtime.ioDevices.userData._username = name;
}));

document.body.appendChild(windowDiv);

titleBar.onmousedown = function (e) {
    e.preventDefault();
    let offsetX = e.clientX - windowDiv.getBoundingClientRect().left;
    let offsetY = e.clientY - windowDiv.getBoundingClientRect().top;

    function mouseMoveHandler(e) {
        windowDiv.style.left = (e.clientX - offsetX) + 'px';
        windowDiv.style.top = (e.clientY - offsetY) + 'px';
    }

    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};
