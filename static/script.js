function parse_data(){
    var data = []
    $(".left-main-container .example-block").each(function(index){
        var that1 = $(this)
        var example_dic = {}
        that1.children(".qcontainer").each(function(index){
            var that2 = $(this)
            var ques_list = []
            that2.children(".question-container").each(function(index){
                var that3 = $(this)
                that3.children(".span").each(function(index){
                    ques_list.push($(this).text())
                })
            })
            example_dic.questions = ques_list 
        })

        that1.children(".acontainer").each(function(index){
            var that2 = $(this)
            var ans_list = []
            that2.children(".question-container").each(function(index){
                var that3 = $(this)
                that3.children(".span").each(function(index){
                    ans_list.push($(this).text())
                })
            })
            example_dic.answers = ans_list 
        })
        data.push(example_dic)
    })
    return data
}

function train_agent(){
    var assembled_data = parse_data()
    if($("#check-contrib").is(":checked")) {
        $.ajax({
            type: 'POST',
            url: 'https://botbakerservice.herokuapp.com/contribute/classification/push',
            data: JSON.stringify({"data":assembled_data}),
            success: function(resp) {
                console.log('thanks, data shared with a-mma')
            },
            error: function (jqXHR, exception){console.log('sorry, data sharing with a-mma somehow failed')},
            contentType: "application/json",
            dataType: 'json'
        })
    }

    $("#train-button").text('training agent..')
    $.ajax({
        type: 'POST',
        url: '/',
        data: JSON.stringify({"data":assembled_data}),
        success: function(resp) {
            $("#train-button").text('trainig completed.')
            window.setTimeout(function(){$("#train-button").text('start trainig')},2000)
        },
        error: function (jqXHR, exception){$("#train-button").text('try again')},
        contentType: "application/json",
        dataType: 'json'
    })
}

function test(){
    var query = $('.right-main-container .chatbox').val()
    $('.right-main-container .remaining').prepend('<div class="user-bubble"><p>'+query+'</p></div>')
    $('.right-main-container .chatbox').val('')
    $.ajax({
        type: 'POST',
        url: '/predict',
        data: JSON.stringify({"data":{"query":query}}),
        success: function(resp) {
            window.setTimeout(function(){$('.right-main-container .remaining').prepend('<div class="bot-bubble"><p>'+JSON.parse(resp).prediction+'</p></div>')},1000)
        },
        error: function (jqXHR, exception){console.log('error')},
        contentType: "application/json",
        dataType: 'json'
    })
}

function ui_changed_begin(){
    $("#train-button").text('start trainig')
}

function ui_changed_end(){

}


function add_block(){
    ui_changed_begin()
    var block_count = $(".main-container .left-main-container .remaining .example-block").length
    block_count ++
    $(".main-container .left-main-container .remaining").prepend('<div class="seperator"></div><a onclick="delete_intent(this.id)" id="'+block_count+'-abut" class="button">delete this intent</a><div id="'+block_count+'-exblk" class="example-block"><div class="seperator"></div><div class="qcontainer"><input type="text" placeholder="enter your example question to invoke this intent" /><button id="'+block_count+'" onclick="add_question(this.id)">add</button></div><div class="seperator"></div><div class="acontainer"><input type="text" placeholder="enter your answer to choose randomly by the bot" /><button id="'+block_count+'" onclick="add_answer(this.id)">add</button></div><div class="seperator"></div><div class="seperator"></div></div>')
    ui_changed_end()
}

function add_question(id){
    ui_changed_begin()
    var block_count = $(".example-block").length
    block_count = block_count - parseInt(id)
    var quest = $(".example-block:eq("+block_count+") .qcontainer input").val()
    if (quest && quest !== ''){
        $(".example-block:eq("+block_count+") .qcontainer").append('<div class="question-container" id="'+$.now()+'-qcontainer"><div class="span"><span>'+quest+'</span></div><div class="span_c"><button id="'+$.now()+'-dbutton" onclick="delete_qcontainer_by_id(this.id)">delete</button></div></div>')
        var quest = $(".qcontainer input").val('')
    }
    ui_changed_end()
}

function add_answer(id){
    ui_changed_begin()
    var block_count = $(".example-block").length
    block_count = block_count - parseInt(id)
    var ans = $(".example-block:eq("+block_count+") .acontainer input").val()
    if (ans && ans !== ''){
        $(".example-block:eq("+block_count+") .acontainer").append('<div class="question-container" id="'+$.now()+'-qcontainer"><div class="span"><span>'+ans+'</span></div><div class="span_c"><button id="'+$.now()+'-dbutton" onclick="delete_qcontainer_by_id(this.id)">delete</button></div></div>')
        var ans = $(".acontainer input").val('')
    }
    ui_changed_end()
}

function delete_intent(id){
    ui_changed_begin()
    $("#"+id.split('-')[0]+"-exblk").remove()
    $("#"+id).remove()
    ui_changed_end()
}

function delete_qcontainer_by_id(id){
    ui_changed_begin()
    $("#"+id).remove()
    $("#"+id.split('-')[0]+"-qcontainer").remove()
    ui_changed_end()
}