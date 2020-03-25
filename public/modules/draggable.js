!function (exports) {
    const draggable = function () {
        let self = {}; // private API
        let draggable = {}; // public API

        // Plugin defaults
        let defaults = {
            selectorsList: {
                dragElement: '.item',
                contentItem: '.content',
                dropPlace: '.droppable',
                removeItem: '.remove-item',
            }
        };

        /*-------- PRIVATE METHODS STARTED----------------------------------------------------------*/
        /**
         *
         * @param data
         * @return {boolean}
         */
        self.isFunction = (data) => {
            return (typeof data === 'function');
        };
        /**
         *
         * @return {number}
         */
        self.createNewId = () => {
            let length = document.querySelectorAll('.item').length;

            if (length) {
                return document.querySelectorAll('.item').length + 1;
            }

            return 1;
        };
        self.initAppendAfter = () => {
            Element.prototype.appendAfter = function (element) {
                element.parentNode.insertBefore(this, element.nextSibling);
            };
        };
        /**
         *
         * @type {{onDrop: onDrop, onDropSave: onDropSave, onDragOver: onDragOver, onDragStart: onDragStart, onDragLeave: onDragLeave, onDragEnter: onDragEnter}}
         */
        self.listenEvent  ={
            onDragEnter: function (event) {
                if (self.isFunction(self.options.events.onDragEnter)) {
                    self.options.events.onDragEnter(event);
                }

                event.preventDefault();
            },
            onDragLeave: function (event) {
                if (self.isFunction(self.options.events.onDragLeave)) {
                    self.options.events.onDragLeave(event);
                }

                event.preventDefault();
            },
            onDrop: function (element = false) {
                let callback  = (event) => {
                    self.drag(event);

                    if (self.isFunction(self.options.events.onDrop)) {
                        self.options.events.onDrop(event);
                    }
                };

                if (element) {
                    element.addEventListener('drop', callback);
                } else {
                    document.querySelectorAll(self.options.selectorsList.dropPlace).forEach(item => {
                        item.addEventListener('drop', callback);
                    })
                }
            },
            onDragStart: function (element = false) {
                let callback = (event) => {
                    self.drag(event);

                    if (self.isFunction(self.options.events.onDragStart)) {
                        self.options.events.onDragStart(event);
                    }
                };

                if (element) {
                    element.addEventListener('dragstart', callback);
                } else {
                    document.querySelectorAll(self.options.selectorsList.dragElement).forEach(item => {
                        item.addEventListener('dragstart', callback);
                    })
                }
            },
            onDropSave: function (element = false) {
                let callback = (event) => {
                    self.append(event);

                    if (self.isFunction(self.options.events.drop)) {
                        self.options.events.drop(event);
                    }
                };

                if (element) {
                    element.addEventListener('drop', callback);
                } else {
                    document.querySelectorAll(self.options.selectorsList.dropPlace).forEach(item => {
                        item.addEventListener('drop', callback);
                    })
                }
            },
            onDragOver: function (element = false) {
                let callback = (event) => {
                    self.allowDrop(event);

                    if (self.isFunction(self.options.events.onDragOver)) {
                        self.options.events.onDragOver(event);
                    }
                };

                if (element) {
                    element.addEventListener('dragover', callback);
                } else {
                    document.querySelectorAll(self.options.selectorsList.dropPlace).forEach(item => {
                        item.addEventListener('dragover', callback);
                    })
                }
            },
        };
        /**
         *
         * @param element
         * @return {ActiveX.IXMLDOMNode | Node}
         */
        self.createClone = (element) => {
            let newElement = element.cloneNode(true);
            newElement.id = "id" + self.createNewId();
            newElement.classList.remove("copy");
            newElement.classList.add("move");

            return newElement;
        };
        self.allowDrop = (event) =>  {
            event.preventDefault();
        };
        self.drag = (event) => {
            return event.dataTransfer.setData("text", event.target.id);
        };
        self.append =  (event) => {
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

            newElement.addEventListener("dragenter", function (ev) {
                if (self.isFunction(self.options.events.onDragEnter)) {
                    self.options.events.onDragEnter(newElement);
                }
            });

            newElement.addEventListener("dragleave", function (ev) {
                if (self.isFunction(self.options.events.onDragLeave)) {
                    self.options.events.onDragLeave(newElement);
                }
            });

            self.listenEvent.onDrop(newElement);
            self.listenEvent.onDragStart(newElement);
            self.listenEvent.onDropSave(newElement);
            self.listenEvent.onDragOver(newElement);

            if (event.target.classList.contains(self.options.selectorsList.dropPlace.split('.').join(""))) {
                event.target.appendChild(newElement);

                if (self.isFunction(self.options.events.onFinishDrop)) {
                    self.options.events.onFinishDrop(newElement);
                }
            }
        };

        /**
         * private options
         *
         */
        self.options = {
            events: { // Event draggable
                onFinishDrop: () => {},
                onDragEnter: () => {},
                onDragLeave: () => {},
                onDrop: () => {},
                onDragStart: () => {},
                onDragOver: () => {},
                onRemove: () => {},
            },
        };

        self.activeEvents = () => {
            self.listenEvent.onDrop();
            self.listenEvent.onDragStart();
            self.listenEvent.onDropSave();
            self.listenEvent.onDragOver();
        };

        /*-------- PRIVATE METHODS END----------------------------------------------------------*/

        /*-------- PUBLIC METHODS STARTED----------------------------------------------------------*/
        draggable.removeItem = (element) => {
            element.remove();

            if (self.isFunction(self.options.events.onRemove)) {
                self.options.events.onRemove(element);
            }
        };
        /*-------- PUBLIC METHODS END----------------------------------------------------------*/

        /**
         * Public initialization
         *
         * @param options
         * @returns draggable
         */
        draggable.init = function (options) {
            console.log('draggable  initialized...');
            self.options = Object.assign(self.options, defaults, options);
            self.activeEvents();
            self.initAppendAfter();

            return draggable;
        };

        return draggable;
    };

exports.draggable = draggable();
}(this);

