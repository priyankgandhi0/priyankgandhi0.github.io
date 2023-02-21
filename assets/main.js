/*

  THINGS TO NOTE
        - Each task list item has a class of .task
        - When the task is being swiped right, try adding the class of .completing
        - When the task is being swiped left, try adding the class of .deleting
        - A completed task should have a class of .completed
    
    - The check and crosses are added as :before and :after pseudo-elements of the .task li so you don't need to add them
    
      GOOD LUCK!

*/


/* 
  Note: classList doesn't work great in IE without a shim, but as 
  this was intended as a fun exercise I'm omitting it :)
*/
setTimeout(() => {
(function() {
    var list = document.getElementsByClassName('task-list')[0];
    var tasks = document.getElementsByClassName('task');
    var mouseOrigin;
    var isSwiping = false;
    var mouseRelease;
    var currentTask;
    var swipeMargin = 20;
    var originalClassList;

    Array.prototype.forEach.call(tasks, function addSwipe(element) {
        element.addEventListener('mousedown', startSwipe);
    });

    /* 
      Defined events on document so that a drag or release outside of target 
      could be handled easily 
    */
    document.addEventListener('mouseup', endSwipe);
    document.addEventListener('mousemove', detectMouse);


    //STARTSWIPE
    function startSwipe(evt) {
        mouseOrigin = evt.screenX;
        currentTask = evt.target;
        isSwiping = true;
        originalClassList = evt.target.classList.value;
    }

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    //ENDSWIPE
    function endSwipe(evt) {
        var completedTask;
        var currentTaskDiv = currentTask;
        if (currentTask.classList.contains("completing")) {
            // currentTask.classList.remove("completing");
            // currentTask.classList.add("completed");
            // list.appendChild(currentTask);
            var dataString = new FormData();
            dataString.append("id", $(currentTask).data('id'));
            dataString.append("swip", 1);
            alert();
            promiseajaxcall2('https://api.todoist.com/rest/v2/projects', '', 'GET').then(function (data) {
                if (!$.isEmptyObject(data[1])) {
                    var TaskArray = [];
                    const TaskData = {type:"item_move", uuid:"'"+makeid(5)+"-"+makeid(5)+"-"+makeid(5)+"-"+makeid(5)+"-"+makeid(5)+"'", args:{id:$(currentTask).data('id'),project_id:data[1].id}};
                    TaskArray.push(TaskData);
                    promiseajaxcall3('https://api.todoist.com/sync/v9/sync', TaskArray, 'POST').then(function (taskdata) {
                        console.log(taskdata);    
                        // if (!$.isEmptyObject(taskdata)) {
                        //     $.each(taskdata, function (key, value) {
                        //         var html = `<li class="task" data-id="${value.id}">${value.content}
                        //             </li>`;
                        //         $('.task-list').append(html);
                        //     });
                        // }
                    }).catch(function (err) { });
                }
            }).catch(function (err) { });








            // promiseajaxcall('home/addTask', dataString).then(function(data) {
            //     if (data.flag) {
            //         $(currentTaskDiv).remove();
            //     }
            // }).catch(function(err) {});
        } else if (currentTask.classList.contains("deleting")) {
            var dataString = new FormData();
            dataString.append("id", $(currentTask).data('id'));
            dataString.append("swip", 2);
            // promiseajaxcall('home/addTask', dataString).then(function(data) {
            //     if (data.flag) {
            //         $(currentTaskDiv).remove();
            //     }
            // }).catch(function(err) {});
        }
        mouseOrigin = null;
        isSwiping = false;
        currentTask.style.margin = 0;
        currentTask = null;
    }

    //DETECTMOUSE
    function detectMouse(evt) {
        var currentMousePosition = evt.screenX;
        var swipeDifference = Math.abs(mouseOrigin - currentMousePosition)
        if (isSwiping && currentTask && (swipeDifference > swipeMargin)) {
            if ((swipeDifference - swipeMargin) <= swipeMargin) {
                //no change, allows user to take no action
                currentTask.classList.remove("completing");
                currentTask.classList.remove("deleting");
                currentTask.style.margin = 0;
            } else if (mouseOrigin > currentMousePosition) {
                //swipe left      
                currentTask.classList.remove("completing");
                currentTask.classList.add("deleting");
                currentTask.style.marginLeft = -swipeDifference + "px";
            } else if ((mouseOrigin < currentMousePosition) &&
                !currentTask.classList.contains("completed")) {
                //swip right");
                currentTask.classList.remove("deleting");
                currentTask.classList.add("completing");
                currentTask.style.marginLeft = swipeDifference + "px";
            }
        }
    }

})();
}, 3000);


async function promiseajaxcall(url, dataString, method = "POST") {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: BASE_URL + '/' + url,
            type: method,
            data: dataString,
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






async function promiseajaxcall2(url, dataString, method = "POST") {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            data: dataString,
            beforeSend: function(xhr) { 
                xhr.setRequestHeader("Authorization", "Bearer 0501b84915c4ece7901afdfd82a1625bca190b30"); 
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


async function promiseajaxcall3(url, dataString, method = "POST") {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            data: { commands: dataString },
            beforeSend: function(xhr) { 
                xhr.setRequestHeader("Authorization", "Bearer 0501b84915c4ece7901afdfd82a1625bca190b30"); 
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
              },
            cache: false,
            contentType: "application/json",
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

window.onload = function () {
    promiseajaxcall2('https://api.todoist.com/rest/v2/projects', '', 'GET').then(function (data) {
        if (!$.isEmptyObject(data[0])) {
            promiseajaxcall2('https://api.todoist.com/rest/v2/tasks?project_id=' + data[0].id, '', 'GET').then(function (taskdata) {
                if (!$.isEmptyObject(taskdata)) {
                    $.each(taskdata, function (key, value) {
                        var html = `<li class="task" data-id="${value.id}">${value.content}
                            </li>`;
                        $('.task-list').append(html);
                    });
                }
            }).catch(function (err) { });

        }
    }).catch(function (err) { });
}