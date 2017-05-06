var addPlayEvents = function () {
    $('.addMusicToListAndPlay').click(function () {
        window.parent.$.addSongToPlayer($(this).attr("id"), true);
    });
    $('.addMusicToList').click(function () {
        window.parent.$.addSongToPlayer($(this).attr("id"), false);
    });

    $('.addMusicListToListAndPlay').click(function () {
        var listId = $(this).attr("id");
        $.ajax({
            url: "getSongListSongId",
            type: "POST",
            data: {
                "listId": listId
            },
            dataType: "json",
            success: function (ret) {
                if (ret.length > 0) {
                    window.parent.$.addSongsToPlayerAndPlay(ret);
                } else {
                    alert("该歌单内无歌曲");
                }
            }
        });
    });
    $('.addMusicListToList').click(function () {
        var listId = $(this).attr("id");
        $.ajax({
            url: "getSongListSongId",
            type: "POST",
            data: {
                "listId": listId
            },
            dataType: "json",
            success: function (ret) {
                for (var i = 0; i < ret.length; i++) {
                    window.parent.$.addSongToPlayer(ret[i], false);
                }
            }
        });
    });
    $('.addAlbumToList').click(function () {
        var albumId = $(this).attr("id");
        $.ajax({
            url: "getAlbumSongId",
            type: "POST",
            data: {
                "albumId": albumId
            },
            dataType: "json",
            success: function (ret) {
                for (var i = 0; i < ret.length; i++) {
                    window.parent.$.addSongToPlayer(ret[i], false);
                }
            }
        });
    });
    $('.addAlbumToListAndPlay').click(function () {
        var albumId = $(this).attr("id");
        $.ajax({
            url: "getAlbumSongId",
            type: "POST",
            data: {
                "albumId": albumId
            },
            dataType: "json",
            success: function (ret) {
                if (ret.length > 0) {
                    window.parent.$.addSongsToPlayerAndPlay(ret);
                }
            }
        });
    });
    $('.icon-control-pause').click(function () {
        window.parent.$.getMyPlaylist().pause();
    });

}