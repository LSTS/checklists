var fbkey = sanitize_id(window.location.pathname);
var fburl = "https://xeklists.firebaseio.com/"+fbkey;

var Checklist = Checklist || function () {

  // The checklist object.
  var checklist;

  // Define the model.
  var CheckBoxModel = Backbone.Model.extend({
    defaults: {
      checked: false
    },
  });

  var connectedRef = new Firebase(fburl).database().ref(".info/connected");
  
  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      alert("connected");
    } else {
      alert("not connected");
    }
  });

  // Define the collection.
  var CheckBoxCollection = Backbone.Firebase.Collection.extend({
    url: fburl,
    model: CheckBoxModel,

    // Gets an existing model, otherwise creates new and returns.
    gain: function(id) {
      if (!this.get(id)) {
        this.add({ id: id });
      }
      return this.get(id);
    }
  });

  // Define the view associated with a checkbox.
  var CheckBoxView = Backbone.View.extend({
    tagName: 'input',

    attributes: {
      type: 'checkbox'
    },

    events: {
      'change': 'change'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.attr('checked', this.model.get('checked'));

      return this;
    },

    change: function () {
      this.model.save({ checked: this.$el.is(':checked') });
    }
  });

  // Define the view associated with a list item.
  var ListItemView = Backbone.View.extend({
    initialize: function() {
      var checkBoxView = new CheckBoxView({ model: this.model });
      this.$el
        .prepend(checkBoxView.render().el)
        .wrapInner('<label />');

      this.listenTo(this.model, 'change', this.update);
      this.update();
    },

    update: function() {
      this.$el.attr('data-checked', this.model.get('checked'));
    },
  });

  // Attaches checklist views to HTML list items.
  var attachChecklist = function(checklist) {
    $('.checklist').each(function(index) {

      // Get an HTML list ID.
      var checklistId = $(this).attr('id') || '_checklist_' +  index + '_';

      $(this).find('>li').each(function(index) {

        // Attach a view to a list item.
        new ListItemView({
          el: $(this),
          model: checklist.gain(checklistId + '-' + index)
        });
      });
    });
  };

  // Returns init function.
  return {
    init: function(storageId) {

      // Set falback storage ID based on the current URL.
      storageId = storageId ||  window.location.origin + window.location.pathname;

      // Create local storage with given ID.
      _.extend(CheckBoxCollection.prototype, {
        localStorage: new Backbone.LocalStorage(storageId)
      });

      // Create collection instance.
      this.checklist = new CheckBoxCollection();

      // Fetch data from the storage.
      this.checklist.fetch({ success: attachChecklist });
    },

    // Returns clear function.
    clear: function(storageId) {

      localStorage.clear();
      location.reload();

    },

    exportAsJson: function() {
      let href = window.location.pathname
      href = href.replace('missions/','').replace('preparation/','').replace('.html','')
      let paths = href.split("/")
      paths.shift()
      for(let i = 0; i < paths.length; i++) {
        paths[i] = firstLetterUpper(paths[i])
      }
      let fileName = paths.join('/')
      let lastName = paths[paths.length - 1]
      paths.pop()
      let pathsFilt = []
      for(let i = 0; i < paths.length; i++) {
        if (i != paths.length -1 && paths[i+1].startsWith(paths[i])) continue
        pathsFilt.push(paths[i])
      }
      paths = pathsFilt
      let gname = paths.join('/')
      if (gname == '')
        gname = lastName

      let checklistListJson = []
      
      $('.checklist').each(function(index, val) {
        let name = val.previousElementSibling.innerHTML // its the h3 as title
        // console.log(">>>> " + name)
        let itemsJsonObj = []
        
        // Get an HTML list ID.
        var checklistId = $(this).attr('id') || '_checklist_' +  index + '_';
        
        $(this).find('>li').each(function(index, val) {
          let item = {}
          //console.log("xxxxx!  " + val.children[0].innerHTML);
          // item["checklist_name"] = val.children[0].children[0].innerHTML
          // item["checked"] = $(this).attr('data-checked').innerHTML

          $(this).find('>label > input').each(function(index, val) {
            let ns = val.nextSibling
            // console.log("-----!  " + (ns.innerText || ns.textContent));
            item["item_name"] = firstLetterUpper((ns.innerText || ns.textContent).trim())
            item["checked"] = val.checked
          });
          itemsJsonObj.push(item)
        });

        let clJsonData = {
          "checklist_name": firstLetterUpper(name),
          "label": lastName,
          "items": itemsJsonObj,
        }
        checklistListJson.push(clJsonData)
      });

      let jsonData = {
        "group_name": lastName,
        "label": gname,
        "checklists": checklistListJson,
      }

      let dataStr = JSON.stringify(jsonData);
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
      let exportFileDefaultName = fileName.replace('/', '_')+'.json';
  
      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
  }
}();

function sanitize_id(ustr_id) {
  var regex = '[^-A-Za-z0-9+=_]';
  return ustr_id.replace(new RegExp(regex, 'gi'), '');
}
