/* <input
    type="file"
    name="upload[]"
    class="upload-image-widget"
    data-uiw-width="400" -> width
    data-uiw-height="200" -> height
    data-uiw-model="contain" -> model:cover/contain, default: cover
    data-uiw-path="A.jpg"
    data-uiw-base64="true"
    data-uiw-delete="true/false" 
    data-uiw-remove="true/false" 
> */

$(function () {
    uploadImageWidget = {
        init: function () {
            this.update();
            this.$body = $("body");
            this.$body.delegate(".uiw-image", "change", function () {
                var $this = $(this);
                var self = this;
                var $wrapper = $this.closest(".upload-image-widget-wrapper");
                var $status = $wrapper.find(".uiw-status");
                var width = $this.attr("data-uiw-width");
                var height = $this.attr("data-uiw-height");
                var base64 = $this.attr("data-uiw-base64");
                var path = $this.val();

                if (path == "") return false;

                var file = path.split("\\").pop();
                var file_type = file.split(".").pop();

                file = file.replace(/ /g, "_");

                if (file_type != "" && file_type != "jpg" && file_type != "jpeg" && file_type != "png" && file_type != "svg") {
                    $wrapper.find(".uiw-remove").click();
                    alert("Not support the upload format");
                    return false;
                }

                var source = URL.createObjectURL(this.files[0]);
                if ($wrapper.hasClass('auto')) {
                    $wrapper.addClass("has-data update auto");
                    $wrapper.css({
                        width: width
                    });
                    $wrapper.find('.uiw-element-img').attr("src", source);
                } else {
                    $wrapper.css({
                        width: width,
                        height: height
                    });
                    $wrapper.addClass("has-data update");
                    $wrapper.css("background-image", "url(" + source + ")");
                }

                $wrapper.find(".uiw-file").val(file);

                if (base64) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var source = reader.result;
                        $wrapper.find(".uiw-base64").val(source);
                    };
                    reader.readAsDataURL(self.files[0]);
                }

                $status.val("upload");
            });

            this.$body.delegate(".uiw-change", "click", function () {
                var $this = $(this);
                var $wrapper = $this.closest(".upload-image-widget-wrapper");
                var $label = $wrapper.find(".uiw-image-label");
                $label.find("input").click();
            });

            this.$body.delegate(".uiw-remove", "click", function () {
                var $this = $(this);
                var $wrapper = $this.closest(".upload-image-widget-wrapper");
                var $status = $wrapper.find(".uiw-status");
                var $input = $wrapper.find(".uiw-image");
                var $base64 = $wrapper.find(".uiw-base64");
                var remove = $wrapper.find(".upload-image-widget").attr('data-uiw-remove') || "true";

                if (remove === "true") {
                    $wrapper.remove();
                } else {

                    $wrapper.removeAttr("style");

                    if ($wrapper.hasClass('auto')) {
                        $wrapper.find('.uiw-element-img').attr("src", '');
                    } else {
                        $wrapper.css("background-image", "");
                    }

                    $wrapper.find(".uiw-file").val("");
                    $wrapper.removeClass("has-data");
                    $status.val("remove");
                    $input.val("");
                    $base64.val("");
                }
            });
        },

        //set width and height, but effect cover or contain
        fixed: function ($element) {

            var html = "";
            var file = "";
            var style = "";
            var status = "";
            var has_data = "";

            var field = $element.attr("name");
            var path = $element.attr("data-uiw-path") || "";
            var model = $element.attr("data-uiw-model") || "cover";
            var deleteAble = $element.attr("data-uiw-delete") || "true";

            $element.addClass("is-upload-image-widget uiw-image");

            var obj = $('<div>').append($element.clone()).html();
            var element = new String(obj);

            if (path !== '') {
                var width = $element.attr("data-uiw-width");
                var height = $element.attr("data-uiw-height");
                style = 'style="width:' + width + 'px;height:' + height + 'px;background-image:url(' + path + ');"';
                has_data = " has-data";
                status = "static";
                file = path.split("/").pop();
            }

            html = '<div class="upload-image-widget-wrapper ' + model + has_data + '"' + style + '>';
            html += '<label class="uiw-image-label">';
            html += element
            html += '<span class="uiw-btn">';
            html += 'UPLOAD';
            html += '</span>';
            html += '</label>';
            if (deleteAble === "true") {
                html += '<div class="uiw-remove"></div>';
                html += '<div class="uiw-change"></div>';
            } else {
                html += '<div class="uiw-change" style="right:0"></div>';
            }

            html += '<input type="hidden" name="uiw_base64_' + field + '" value="" class="uiw-base64">';
            html += '<input type="hidden" name="uiw_file_' + field + '" value="' + file + '" class="uiw-file">';
            html += '<input type="hidden" name="uiw_status_' + field + '" value="' + status + '" class="uiw-status">';
            html += '</div>';
            return html;
        },

        //only set width, height auto
        auto: function ($element) {

            var html = "";
            var file = "";
            var status = "";
            var has_data = "";

            var field = $element.attr("name");
            var width = $element.attr("data-uiw-width");
            var path = $element.attr("data-uiw-path") || "";
            var deleteAble = $element.attr("data-uiw-delete") || "true";

            $element.addClass("is-upload-image-widget uiw-image");

            var obj = $('<div>').append($element.clone()).html();
            var element = new String(obj);

            if (path !== '') {
                has_data = "has-data";
                status = "static";
                file = path.split("/").pop();
            }

            html = '<div class="upload-image-widget-wrapper auto ' + has_data + '" style="width:' + width + 'px">'
            html += '<img src="' + path + '" class="uiw-element-img" >';
            html += '<label class="uiw-image-label">';
            html += element
            html += '<span class="uiw-btn">';
            html += 'UPLOAD';
            html += '</span>';
            html += '</label>';
            if (deleteAble === "true") {
                html += '<div class="uiw-remove"></div>';
                html += '<div class="uiw-change"></div>';
            } else {
                html += '<div class="uiw-change" style="right:0"></div>';
            }

            html += '<input type="hidden" name="uiw_base64_' + field + '" value="" class="uiw-base64">';
            html += '<input type="hidden" name="uiw_file_' + field + '" value="' + file + '" class="uiw-file">';
            html += '<input type="hidden" name="uiw_status_' + field + '" value="' + status + '" class="uiw-status">';
            html += '</div>';
            return html;
        },

        convertToBase64: function ($element, path) {
            var img = new Image();
            var $base64_element = $element.find(".uiw-base64");
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var type = path.split(".").pop();
                var file = "";

                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);

                if (type == 'png') {
                    file = canvas.toDataURL('image/png');
                } else {
                    file = canvas.toDataURL('image/jpeg');
                }
                $base64_element.val(file);
            };
            img.src = path;
        },

        update: function () {
            var self = this;
            $(".upload-image-widget").each(function () {
                var $this = $(this);
                var element = "";
                var $element = "";
                var base64 = $this.attr("data-uiw-base64") || "false";
                var path = $this.attr("data-uiw-path") || "";

                if ($this.hasClass("is-upload-image-widget")) return true;
                if ($this.attr('data-uiw-width') === undefined) {
                    console.log("Error: upload image widget need set data-uiw-width");
                    return false;
                }
                element = self.generate($this);
                $element = $(element);
                $element.insertAfter($this);
                $this.remove();

                if (base64 === "true" && path != "") {
                    self.convertToBase64($element, path);
                }
            });
        },

        generate: function ($element) {
            if ($element.attr('data-uiw-height') === undefined) {
                return this.auto($element);
            } else {
                return this.fixed($element);
            }
        }
    };

    uploadImageWidget.init();
});
