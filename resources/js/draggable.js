
!function (exports) {
    /**
     *
     * @returns {draggable }
     */
    draggable = function () {
        var self = {}, // private API
            draggable = {}, // public API

            // Plugin defaults
            defaults = {
                //if needed
            };

        /*-------- PRIVATE METHODS STARTED----------------------------------------------------------*/

        /**
         * private options
         *
         */
        self.isFunction = (data) => {
            return (typeof data === 'function') ? true : false;
        },
        /**
         *
         */
        self.createNewId = () => {
            return parseInt(document.querySelectorAll('.item').length) + 1;
        },

        self.createClone = (element) => {
            let newElement = element.cloneNode(true);
            newElement.id = "id" + self.createNewId();
            newElement.classList.remove("copy");
            newElement.classList.add("move");

            return newElement;
        },

        /**
         *
         */
        // self.remove = (event) => {
        //     console.log('remove!!!!!!!!!');
        //     return event.remove();
        // },

        self.options = {
            selectorsList: {
                dragElement: '.item',
                contentItem: '.content',
                dropPlace: '.droppable',
                removeItem: '.remove-item',
            },

            event: {}, // Event draggable
            /**
             *
             * @param event
             */
            allowDrop: function (event) {
                return event.preventDefault();
            },
            /**
             *
             * @param event
             */
            drag: function (event) {
                return event.dataTransfer.setData("text", event.target.id);
            },

            listernEvent: {
                /**
                 *
                 * @param event
                 */
                dragEnter: function (event) {
                    // console.log(event.target.classList);

                    if (!event.target.classList.contains("focus")) {
                        event.target.classList.add("focus");
                    }

                    event.preventDefault();
                },
                /**
                 *
                 * @param event
                 */
                dragLeave: function (event) {
                    event.target.classList.remove("focus");
                    event.preventDefault();
                },
                /**
                 *
                 */
                onDrop: function () {
                    document.getElementsByClassName("example").ondrop = function () {
                    };
                },
                /**
                 *
                 */
                onDragStart: function () {
                    document.querySelectorAll(self.options.selectorsList.dragElement).forEach(item => {
                        item.addEventListener('dragstart', event => {
                            console.log('ondragstart');
                            self.options.drag(event);
                        })
                    });
                },
                /**
                 *
                 */
                onDropSave: function () {
                    document.querySelectorAll(self.options.selectorsList.dropPlace).forEach(item => {
                        item.addEventListener('drop', event => {
                            console.log('append');
                            self.options.append(event);
                        })
                    });
                },
                /**
                 *
                 */
                onDragOver: function () {
                    document.querySelectorAll(self.options.selectorsList.dropPlace).forEach(item => {
                        item.addEventListener('dragover', event => {
                            console.log('allowDrop');
                            self.options.allowDrop(event);
                        })
                    });
                },

                // removeElement: function() {
                //     document.querySelectorAll(self.options.selectorsList.removeItem).forEach(item => {
                //         item.addEventListener('click', event => {
                //             console.log('remove item');
                //             self.remove(event);
                //         })
                //     });
                // }
            },
            /**
             *
             * @param event
             */
            append: function (event) {
                event.preventDefault();
                event.target.classList.remove("focus");

                const data = event.dataTransfer.getData("text");
                const element = document.getElementById(data);
                let newElement;


                // checks if an item is copyable or moveable
                if (element.classList.contains("copy")) {
                    newElement = self.createClone(element);
                } else if (element.classList.contains("move")) {
                    newElement = element;
                }
                /**
                 * An event to add and remove classes when another drag item is on top of it.
                 */
                // console.log(newElement.target.querySelector('.content'));

                // console.log(newElement.querySelector('.content'));
                // console.log(newElement.target.querySelector('.content'));
                // console.log(newElement);
                newElement.querySelector('.content').addEventListener("dragenter", function (event) {
                    console.log('dragenter');
                    self.options.listernEvent.dragEnter(event);
                    event.preventDefault();

                });

                newElement.addEventListener("dragleave", function (event) {
                    console.log('dragleave');
                    self.options.listernEvent.dragLeave(event);
                });

                if (event.target.classList.contains("droppable")) {
                    // console.log('1111111111111')

                    event.target.appendChild(newElement);

                    if (self.isFunction(self.options.event.finishDrop)) {
                        self.options.event.finishDrop(newElement);
                    }

                    self.options.listernEvent.onDragStart();

                } else if (event.target.classList.contains("item")) {
                    // console.log('22222222222222')
                    newElement.appendAfter(event.target);
                }
            },
            /**
             *
             * @param event
             */
            remove: function (event) {
                event.preventDefault();
                const elem = document.getElementById(ev.dataTransfer.getData("text"));
                if (ev.target.classList.contains("remove") && elem.classList.contains("move")) {
                    elem.parentElement.removeChild(elem);
                }
            },
            /**
             *
             * @param name String
             * @returns {HTMLCollectionOf<Element>}
             */
            getObjectByClass: function (name) {
                return document.getElementsByClassName(name);
            },
            activeEvents: function() {
                self.options.listernEvent.onDrop();
                self.options.listernEvent.onDragStart();
                self.options.listernEvent.onDropSave();
                self.options.listernEvent.onDragOver();
                // self.options.listernEvent.removeElement();
            }
        };

        /*-------- PRIVATE METHODS END----------------------------------------------------------*/

        /*-------- PUBLIC METHODS STARTED----------------------------------------------------------*/
        /**
         *
         */
        draggable.removeItem = (selectorElement) => {
            document.querySelectorAll(selectorElement).forEach(item => {
                item.remove();
            });
        },
        /*-------- PUBLIC METHODS END----------------------------------------------------------*/

        /**
         * Public initialization
         *
         * @param options
         * @returns {{}}
         */
        draggable.init = function (options) {
            console.log('draggable  initialized...');
            self.options = Object.assign(self.options, defaults, options);
            // $.extend(self.options, defaults, options);

            self.options.activeEvents();
            Element.prototype.appendAfter = function (element) {
                element.parentNode.insertBefore(this, element.nextSibling);
            }, false;

            return draggable;
        };

        return draggable;
    };

exports.draggable = draggable();
}(this);

/**
 * jsLogger
 */
// var draggable = new draggable;
draggable.init({
    event: {
        finishDrop: function (newElement) {
            // console.log(newElement);
            // console.log(newElement.querySelector('.image'));
            // console.log(newElement.querySelector('.image')[0]);
            newElement.querySelector('.image').style.backgroundImage = 'url("https://i.imgur.com/G5VqS.jpg")';

            if (!newElement.getElementsByTagName('input')[0]) {
                newElement.querySelector('.content').appendChild(document.createElement('INPUT'));
            }
        }
    }
});
