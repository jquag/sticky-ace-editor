(function() {
  "use strict"

  function configureAceEditorVimCommands(element) {
    ace.config.loadModule("ace/keyboard/vim", function(m) {
      var VimApi = require("ace/keyboard/vim").CodeMirror.Vim
      VimApi.defineEx("write", "w", function(cm, input) {
        element.save();
      });

      VimApi.defineEx("wq", "wq", function(cm, input) {
        element.saveAndQuit();
      });

      VimApi.defineEx("q", "q", function(cm, input) {
        element.quit();
      });
    });
  }

  Polymer({
    is: "app-editor",
    properties: {
      editor: {
        type: Object,
        value: function() { return ace.edit(this.$$("#editor")); }
      },
      value: {
        type: String,
        value: undefined,
        observer: "_valueChanged",
        notify: true
      },
      theme: {
        type: String,
        value: function() { return this._defaultTheme(); },
        observer: "_themeChanged"
      },
      useVim: {
        type: Boolean,
        value: function() { return this._defaultUseVim(); },
        observer: "_useVimChanged"
      }
    },
    attached: function() {
      console.log("app-editor attached");
      configureAceEditorVimCommands(this);
      this.editor = ace.edit(this.$$("#editor"));
      this.editor.setTheme("ace/theme/"+this.theme);
      this.editor.getSession().setMode("ace/mode/markdown");
      if (this.useVim) {
        this.editor.setKeyboardHandler("ace/keyboard/vim");
      }
      this.editor.setPrintMarginColumn(-1);
      this.editor.getSession().setUseWrapMode(true);
      this.editor.setReadOnly(false);

      var _this  = this;
      this.editor.on("blur", function() { _this.value = _this.editor.getValue(); });
    },
    _valueChanged: function(newValue) {
      this.editor.setValue(newValue);
      this.editor.clearSelection();
    },
    _themeChanged: function(newValue) {
      this.editor.setTheme("ace/theme/"+newValue);
      Cookies.set("sticky-ace-theme", newValue);
    },
    _useVimChanged: function(useVim) {
      if (useVim) {
        this.editor.setKeyboardHandler("ace/keyboard/vim");
      } else {
        this.editor.setKeyboardHandler("");
      }
      Cookies.set("sticky-ace-use-vim", useVim);
    },
    _defaultTheme: function() {
      var theme = Cookies.get("sticky-ace-theme");
      if (theme === undefined) {
        theme = "twilight";
      }
      return theme;
    },
    _defaultUseVim: function() {
      var useVim = Cookies.get("sticky-ace-use-vim");
      if (useVim === undefined) {
        useVim = "true";
      }
      return useVim == "true";
    },
    save: function() {
      this.fire("save");
    },
    saveAndQuit: function() {
      this.fire("save-and-quit");
    },
    quit: function() {
      this.fire("quit");
    }
  });
})();
