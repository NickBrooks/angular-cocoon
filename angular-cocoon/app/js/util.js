//log errors
function logErrors(data, status, headers, config) {
    console.log({
        Headers: headers,
        Msg: data,
        Status: status,
        Config: config
    })
}