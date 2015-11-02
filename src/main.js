import ContainerManager from './js/ContainerManager';

let containerManagers = [];

function main() {
  initContainers();
}
function initContainers() {
  $('.container').each(function(idx, el) {
    containerManagers.push(new ContainerManager($(el)));
  });
}

$(document).ready(function() {
  main()
});
