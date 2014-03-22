Vue.component('tag-editer-tag-measure', {
  data: {
    text: ''
  },
  replace: true,
  template: 
    '<div class="tag-editor-tag tag-editor-measure" v-ref="tagMeasure">' +
    '<div class="tag-editor-text" v-text="text"></div>' +
    '</div>'
});

Vue.component('tag-editor-input', {
  data: {
    seperator: /[, ]+/,
    width: 0,
    value: ''
  },
  replace: true,
  template: 
    '<input class="tag-editor-input" v-ref="input" ' +
    'v-style="width: width + \'px\'" v-model="value" v-on="' +
    'keydown: mayDeleteLastTag | key 8, keyup: onKeyup, blur: onBlur' +
    '"></input>',
  ready: function() {
    this.adjustWidth();
  },
  methods: {
    mayDeleteLastTag: function(e) {
      if (!this.value) {
        this.$parent.tags.pop();
      }
    },
    onBlur: function(e) {
      this.mayInsertTags();
    },
    onKeyup: function(e) {
      var val = this.value;
      if (val && this.seperator.test(val)) {
        this.mayInsertTags();
      } else {
        this.adjustWidth();
      }
    },
    mayInsertTags: function() {
      // We need to split tag text with separators
      // because text pasted from clipboard may contain those.
      var tags = this.$parent.tags, words = this.value.split(this.seperator),
          i, len, word;
      this.value = '';
      this.adjustWidth();
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        /* jshint eqeqeq: false */
        if (word && tags.indexOf(word) < 0) {
          tags.push(word);
        }
      }
    },
    adjustWidth: function() {
      var tagMeasure = this.$parent.$.tagMeasure;
      tagMeasure.text = this.value + 'WW';
      this.width = tagMeasure.$el.clientWidth;
    }
  }
});

Vue.component('tag-editor-field', {
  replace: true,
  template:
    '<div id="{{id}}" class="tag-editor-field" v-on="click: onClick">' +
    '<div v-component="tag-editer-tag-measure"></div>' +
    '<div v-repeat="tags" class="tag-editor-tag"><div class="tag-editor-text">{{$value}}</div><a class="tag-editor-delete" v-on="click: onClickDelete">x</a></div>' +
    '<div v-component="tag-editor-input"></div>' +
    '</div>',
  methods: {
    onClick: function(e) {
      this.$.input.$el.focus();
    },
    onClickDelete: function(e) {
      this.tags.splice(e.targetVM.$index, 1);
    }
  }
});
