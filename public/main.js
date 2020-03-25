document.addEventListener("DOMContentLoaded", function() {
    draggable.init({
        events: {
            onFinishDrop: function (newElement) {
                newElement.querySelector('.image').style.backgroundImage = 'url("./public/images/G5VqS.jpg")';

                if (!newElement.getElementsByTagName('input')[0]) {
                    newElement.querySelector('.content').appendChild(document.createElement('INPUT'));
                }

                newElement.querySelector('.remove-item').addEventListener('click', event => {
                    draggable.removeItem(event.target.closest('.item'));
                })
            },
            onDragEnter: () => {
                console.log('onDragEnter');
            },
            onDragLeave: () => {
                console.log('onDragLeave');
            },
            onDrop: () => {
                console.log('onDrop');
            },
            onDragStart: () => {
                console.log('onDragStart');
            },
            onDrop: () => {
                console.log('onDrop');
            },
            onDragOver: () => {
                console.log('onDragOver');
            },
            onRemove: () => {
                console.log('onRemove');
            }
        }
    });
});
