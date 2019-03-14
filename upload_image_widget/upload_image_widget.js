/* 
    model: width, height, both, non;
*/

upload_image_widget = {
    status: "inactive",
    init: function($class){
        var self = this;
        if (this.status == "active") return false;
        this.status = "active";
        this.$body = $("body");
        if ($class) {
            $class.each(function(){
                var $this = $(this);
                var $parent = $this.parent();
                var field = $this.attr("name");
                var path = $this.attr("data-uiw-path");
                var width = $this.attr("data-uiw-width");
                var height = $this.attr("data-uiw-height");
                var mode = $this.attr("data-uiw-mode");
                var del = $this.attr("data-uiw-del");
                var className = $this.attr("class");
                var source = {
                    field: field,
                    width: width,
                    height: height,
                    mode: mode,
                    path: path,
                    del: del,
                    className: className
                };
                var element = self.generate(source);
                $this.remove();
                $parent.append(element);
            });
        }
        this.$body.delegate(".uiw-image", "change", function(){
            var $this = $(this);
            var $uiw = $this.parent().parent();
            var $label = $uiw.find(".uiw-image-label");
            var $status = $uiw.find(".uiw-status");
            var source = URL.createObjectURL(this.files[0]);
    
            $uiw.addClass("has-data update");
            $uiw.css("background-image", "url(" + source + ")");
            $status.val("upload");
        });

        this.$body.delegate(".uiw-change", "click", function(){
            var $this = $(this);
            var $uiw = $this.parent().parent();
            var $label = $uiw.find(".uiw-image-label");
            $label.find("input").click();
        });

        this.$body.delegate(".uiw-remove", "click", function(){
            var $this = $(this);
            var $uiw = $this.parent();
            var $status = $uiw.find(".uiw-status");
            var $input = $uiw.find(".uiw-image");

            $uiw.removeClass("has-data");
            $uiw.css("background-image", "");
            $status.val("remove");
            $input.val("");
        });
        this.$body.delegate('.uiw-del', 'click', function(){
            var $this = $(this);
            var $wrapper = $this.parent();
            $wrapper.remove();
        });
    },

    //set width and height, but effect cover or contain
    fixed: function(s){
        var html = "";
        var file = "";
        var background = "";
        var status = "";
        var has_data = ""

        if (s.path !== '') {
            background = "background-image:url(" + s.path +");";
            has_data = " has-data";
            status = "static";
        }

        html += "<div class='upload-image-widget " + has_data + " "+ s.mode + "' style='width:" + s.width + "px;height:" + s.height + "px;" + background + "'>";
        html += "<label class='uiw-image-label'>";
        html += "<input type='file' name='" + s.field + "' class='uiw-image "+ s.className + "' value=''>";
        html += "<span>";
        html += "UPLOAD";
        html += "</span>";
        html += "</label>";

        if (s.del) {
            html += "<div class='uiw-del'>";
            html += "</div>";
        } else {
            html += "<div class='uiw-remove'>";
            html += "</div>";
        }
        html += "<div class='uiw-change'>";
        html += "</div>";
        if (s.path != "") {
            file = s.path.split("/").pop();
            html += "<input type='hidden' name='uiw_path_" + s.field +"' value='"+file+"'>";
        }
        html += "<input type='hidden' name='status_" + s.field + "' value='" + status + "' class='uiw-status'>";
        html += "</div>";
        return html;
    },

    //only set width, height auto
    auto: function(s){
        //var image = new Image();
        $(s.path).done(function(){
            var html = "";
            var file = "";
            var background = "";
            var status = "";
            var has_data = ""
            var height = this.height / s.width;

            if (s.path !== '') {
                background = "background-image:url(" + s.path +");";
                has_data = " has-data";
                status = "static";
            }

            html += "<div class='upload-image-widget " + has_data + " "+ s.mode + "' style='width:" + s.width + "px;height:" + height + "px;" + background + "'>";
            html += "<label class='uiw-image-label'>";
            html += "<input type='file' name='" + s.field + "' class='uiw-image "+ s.className + "' value=''>";
            html += "<span>";
            html += "UPLOAD";
            html += "</span>";
            html += "</label>";

            if (s.del) {
                html += "<div class='uiw-del'>";
                html += "</div>";
            } else {
                html += "<div class='uiw-remove'>";
                html += "</div>";
            }
            html += "<div class='uiw-change'>";
            html += "</div>";
            if (s.path != "") {
                file = s.path.split("/").pop();
                html += "<input type='hidden' name='uiw_path_" + s.field +"' value='"+file+"'>";
            }
            html += "<input type='hidden' name='status_" + s.field + "' value='" + status + "' class='uiw-status'>";
            html += "</div>";
            return html;
        });
    },

    generate: function(source){
        var _source = {
            field: 'upload',
            width: '300',
            height: '300',
            path: '',
            mode: "cover",
            del: false
        };
        var html = "";
        
        $.extend(_source, source);

        if (this.status == "inactive"){
            this.init();
        }

        switch(_source.mode) {
            case "cover":
            case "contain":
                html = this.fixed(_source);
            break;
            case "auto":
                html = this.auto(_source);
                console.log(html);
            break;
        }
        return html;
    }
};