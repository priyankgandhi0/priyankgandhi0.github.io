async function promiseajaxcall2(url, dataString, method = "POST") {
    showloader();
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
                hideloader();
                resolve(response)
            },
            error: function(err) {
                hideloader();
                reject(err)
            }
        });
    })
}

function API(url, data, method = "POST") {
    showloader();
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
                hideloader();
                resolve(ddata);
            },
            error: function(error) {
                hideloader();
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
        window.location.replace("http://priyankgandhi0.github.io/key.html");
    }
}


function showloader() {
    $(".preloader").css("display", "block !important;");
    $(".preloader").show();
}

function hideloader() {
    $(".preloader").css("display", "none;");
    $(".preloader").hide();
}