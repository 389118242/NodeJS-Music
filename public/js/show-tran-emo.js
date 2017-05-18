/**
 * Created by Rung on 2016/9/9.
 */
var present = 1;
var totalPage = 1;
var addEvents = function (total) {
    $('ul.pagination.pagination-sm li').click(function () {
        var text = $(this).children().html();
        if (isNaN(text)) { // 不是数字
            if ($(this).index() == 0 && present != 1) {
                getComment(present - 1, mid);
            } else if ($(this).index() == total - 1 && present != totalPage) {
                getComment(present + 1, mid);
            }
        } else {// 数字
            getComment(text, mid);
        }
    });
    $('.replyClass').click(function (evnet) {
        if (loginUserId == '') {
            $('#noLogin').modal();
            return;
        }
        var $user = $(this).siblings('a');
        // var uname=$user.text();
        // $('#replyInfo').val(uname);
        replyName = $user.text();
        // var uid = $user.attr('href');
        // $('#replyInfo').attr('name', uid.substring(uid.indexOf('=') + 1));
        replyId = $(this).attr("id");
        $('#reply textarea').val('回复' + replyName + ':');
        $('#reply').modal();
    });
}

var getComment = function (page, id) {
    $
        .ajax({
            url: "getComment",
            type: "POST",
            data: {
                "type": comType,
                "id": id,
                "page": page
            },
            dataType: "json",
            success: function (ret) {
                var list = ret.comList;
                var $parent = $('section.comment-list.block');
                if (list.length > 0) {
                    $parent.children().remove();
                }
                for (var i = 0; i < list.length; i++) {
                    var ii = list[i];
                    // if (ii.userImg == null) {
                    // 	ii.user.userImg = "images/user_default.png";
                    // }
                    var str = '<article id="comment-id-' + ii.comId + '" class="comment-item">'
                        + '<a class="pull-left thumb-sm"> <img src="'
                        + ii.userImg
                        + '" class="img-circle"></a>'
                        + '<section class="comment-body m-b"><header>'
                        + '<a href="profile?userId='
                        + ii.userId
                        + '"><strong>'
                        + ii.userName
                        + '</strong></a> <a data-toggle="modal" '
                        + 'class="btn btn-link pull-right replyClass" id="'
                        + ii.comId
                        + '">回复</a> <label '
                        + 'class="label bg-info m-l-xs"></label><span class="text-muted text-xs block m-t-xs">&nbsp;</span></header>'
                        + '<div class="m-t-sm">'
                        + ii.comContent
                        + '</div></section>';
                    if (ii.p_comId !== null) {
                        // if (ii.p_userImg == null) {
                        //    ii.p_userImg = "images/user_default.png";
                        // }
                        str += '<section class="comment-item comment-reply">'
                            + '<a class="pull-left thumb-sm"><img src="'
                            + ii.p_userImg
                            + '" class="img-circle">'
                            + '</a><section class="comment-body m-b"><header>'
                            + '<a href="profile?userId='
                            + ii.p_userId
                            + '"><strong>'
                            + ii.p_userName
                            + '</strong></a>'
                            + '<label class="label bg-dark m-l-xs"></label>'
                            + '<span class="text-muted text-xs block m-t-xs">&nbsp;</span></header>'
                            + '<div class="m-t-sm">'
                            + ii.p_comContent
                            + '</div>'
                            + '</section>' + '</section>';

                    }
                    $parent.append(str + '<section class="cut-off"></section></article>');
                }

                var bp = ret.bp;
                var ep = ret.ep;
                totalPage = ret.tp;
                present = ret.page
                if (ep > bp) {
                    $('ul.pagination.pagination-sm')
                        .html(
                            '<li><a href="javascript:;"><i '
                            + 'class="fa fa-chevron-left"></i></a></li>'
                            + '<li><a href="javascript:;"><i '
                            + 'class="fa fa-chevron-right"></i></a></li>');
                    for (var i = bp; i < ep + 1; i++) {
                        $('ul.pagination.pagination-sm li:last').before(
                            '<li><a href="javascript:;">' + i
                            + '</a></li>');
                    }
                }
                addEvents(ep - bp + 3);
            }
        });
}
$('button[type=submit][class="abtn btn-success"]').bind({
    click: function (event) {
        var content = $(this).parents('form').find('textarea').val();
        if (loginUserId == '') {
            $('#noLogin').modal();
            event.preventDefault();
            return;
        }
        if (content == '' || content == ('回复' + replyName + ':')) {
            $('#noContent').modal();
            event.preventDefault();
            return;
        }
        $('#temp').html(content).parseEmotion();
        var content = $('#temp').html();
        var comment = new Object();
        comment.type = comType;
        comment.id = mid;
        if (content.startsWith('回复' + replyName + ':')) {
            comment.parentId = parseInt(replyId);
            comment.comContent = content.replace('回复' + replyName + ':', '');
        } else {
            comment.comContent = content;
        }
        $.ajax({
            url: "addComment",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(comment),
            success: function (ret) {
                $('#reply').modal('hide');
                $('textarea').val('');
                if (ret == 1) {
                    getComment(1, mid);
                } else if (ret == -1) {
                    $('#replyRet div.modal-body').append("请重新登录账号");
                } else if (ret == 0) {
                    $('#replyRet div.modal-body').append("评论失败，未知错误");
                } else if (ret == -2) {
                    $('#replyRet div.modal-body').append("您的账号被冻结，无评论权限");
                }
                if(ret != 1)
                    $('#replyRet').modal();
                // TODO 该弹框隐藏后，清除错误信息
            }

        });
        event.preventDefault();
    }
});
$('.face').bind(
    {
        click: function (event) {
            if (!$('#sinaEmotion').is(':visible')) {

                $(this).sinaEmotion();

                if ($(this).siblings("#temp").length == 0) {
                    var loca = $(this).offset();
                    var top = loca.top;
                    var left = loca.left;
                    $('#sinaEmotion').attr(
                        'style',
                        'display:block;position:fixed;top:'
                        + (top + 25) + 'px;left:' + (left + 21)
                        + 'px');
                } else {
                    $('#sinaEmotion').removeAttr('style');
                    $('#sinaEmotion').attr('style', 'display:block');
                }
                event.stopPropagation();
            }
        }
    });
// userInfo?userId=1
// $('.replyClass').click(function(evnet) {
// if (loginUserId == '') {
// $('#noLogin').modal();
// return;
// }
// var $user = $(this).siblings('a');
// // var uname=$user.text();
// // $('#replyInfo').val(uname);
// replyName = $user.text();
// // var uid = $user.attr('href');
// // $('#replyInfo').attr('name', uid.substring(uid.indexOf('=') + 1));
// replyId = $(this).attr("id");
// $('#reply textarea').val('回复' + replyName + ':');
// $('#reply').modal();
// });
$('#reply').on('hidden.bs.modal', function () {
    // $('#replyInfo').val('');
    // $('#replyInfo').removeAttr('name');
    replyId = "";
    replyName = "";
    $('#reply textarea').val('');
})
// $('form button[type=submit]').click(function(event){
// $(this).val();
// event.preventDefault();
// });
$('textarea:first').focus(function () {
    if (loginUserId == '') {
        $('#noLogin').modal();
    }
});
$(function () {
    getComment(1, mid);
})