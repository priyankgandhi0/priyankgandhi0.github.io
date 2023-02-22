async function promiseajaxcall2(url, dataString, method = "POST") {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            data: dataString,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("TODOkey"));
            },
            cache: false,
            contentType: false,
            processData: false,
            async: true,
            dataType: 'JSON',
            error: function() {},
            success: function(response) {
                resolve(response)
            },
            error: function(err) {
                reject(err)
            }
        });
    })
}

function API(url, data, method = "POST") {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("TODOkey"));
            },
            data: JSON.stringify(data),
            dataType: 'json',
            encode: true,
            success: function(ddata) {
                resolve(ddata);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

window.onload = function() {

    if (localStorage.getItem("TODOkey") != null) {
        promiseajaxcall2('https://api.todoist.com/rest/v2/projects', '', 'GET').then(function(data) {
            if (!$.isEmptyObject(data[0])) {
                promiseajaxcall2('https://api.todoist.com/rest/v2/tasks?project_id=' + data[0].id, '', 'GET').then(function(taskdata) {
                    if (!$.isEmptyObject(taskdata)) {
                        if (!$.isEmptyObject(taskdata[0])) {
                            var html = `<li data-id="${taskdata[0].id}">${taskdata[0].content}
                        </li>`;
                            $('#demo').append(html);
                        }
                        // $.each(taskdata, function(key, value) {

                        // });
                    }
                }).catch(function(err) {});
            }
        }).catch(function(err) {});
    } else {
        window.location.replace("http://priyankgandhi0.github.io/todoKey.html");
    }
}