const documentEventService = {
    dispatch(event, data) {
        document.dispatchEvent(new CustomEvent(event, {detail: data}));
    },
    on(event, callback) {
        document.addEventListener(event, (event) => callback(event.detail));
    },
    remove(event, callback) {
        document.removeEventListener(event, callback);
    }
};

export default documentEventService;
