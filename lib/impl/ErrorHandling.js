let asyncErrorListener, errorThrownAlready;

function isAsyncErrorHandler () {
    return asyncErrorListener !== undefined;
}

function triggerAsyncErrorListener (e) {
    if (typeof e !== 'object') {
        e = { message: e };
    }

    e.__isNollupError = true;
    asyncErrorListener(e);
}

function asyncErrorHandler () {
    return new Promise(resolve => {
        asyncErrorListener = resolve;
    });
}

async function asyncErrorWrapper (asyncFn) {
    let result = await Promise.race([asyncFn, asyncErrorHandler()]);
    if (result && result.__isNollupError) {
        asyncErrorListener = undefined;
        throw new Error(result.message + (result.frame? '\n' + result.frame : ''));
    }

    asyncErrorListener = undefined;
    return result;
}

function resetErrorThrownAlready () {
    errorThrownAlready = false;
}

function hasErrorThrownAlready () {
    return errorThrownAlready;
}

function setErrorThrownAlready () {
    errorThrownAlready = true;
}

module.exports = {
    triggerAsyncErrorListener,
    asyncErrorWrapper,
    isAsyncErrorHandler,
    resetErrorThrownAlready,
    hasErrorThrownAlready,
    setErrorThrownAlready
};