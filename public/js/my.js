/**
 * Created by Lenovo on 2016/9/15.
 */
$(function(){
    var options={
        aspectRatio:1/1,
        preview: '.img-yl',
        zoomable:false,
        strict:false,
        minCropBoxWidth: 180,
        minCropBoxHeight: 180
    };
    $('#image').cropper(options);
})