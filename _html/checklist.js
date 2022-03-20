var Checklist = Checklist || function () {

  // The checklist object.
  var checklist;

  // Define the model.
  var CheckBoxModel = Backbone.Model.extend({
    defaults: {
      checked: false
    },
  });

  // Define the collection.
  var CheckBoxCollection = Backbone.Collection.extend({
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

      $('body section').each(function(index, val) {
        let idAttr = val.getAttribute("id")
        if (idAttr != null) {
          let labelToBe = firstLetterUpper(idAttr)
          let lh2 = document.createElement("h2");
          lh2.appendChild(document.createTextNode(labelToBe))
          val.prepend(lh2)
        }
      });

      $('body').each(function(index, val) {
        let fnGnLb = extractFileNameAndGroupNameAndLabel()
        let groupName = fnGnLb[1]
        let lh1 = document.createElement("h1");
        lh1.appendChild(document.createTextNode(groupName))
        val.prepend(lh1)
      });
    },

    // Returns clear function.
    clear: function(storageId) {

      localStorage.clear();
      location.reload();

    },

    exportAsJson: function() {
      // let href = window.location.pathname
      // href = href.replace('missions/','').replace('preparation/','').replace('.html','')
      // let paths = href.split("/")
      // paths.shift()
      // for(let i = 0; i < paths.length; i++) {
      //   paths[i] = firstLetterUpper(paths[i])
      // }
      // let fileName = paths.join('/')
      // let lastName = paths[paths.length - 1]
      // paths.pop()
      // let pathsFilt = []
      // for(let i = 0; i < paths.length; i++) {
      //   if (i != paths.length -1 && paths[i+1].startsWith(paths[i])) continue
      //   pathsFilt.push(paths[i])
      // }
      // paths = pathsFilt
      // let gname = paths.join('/')
      // if (gname == '')
      //   gname = lastName

      let fnGnLb = extractFileNameAndGroupNameAndLabel()
      let fileName = fnGnLb[0]
      let lastName = fnGnLb[1]
      let gname = fnGnLb[2]

      let checklistListJson = []
      
      let noteCheck = null
      $('body div.note').eq(0).each(function(index, val) {
        if (val.parentNode.nodeName.toLowerCase() == 'body' &&
             val.previousElementSibling.nodeName.toLowerCase() != 'h3') {
          let txtNote = processTagsAsText(val)
          if (txtNote != null) {
            noteCheck = (noteCheck ?? '') + txtNote.trim()
          }
        }
      })

      $('.checklist').each(function(index, val) {
        // let name = val.previousElementSibling.innerHTML // its the h3 as title
        // console.log(">>>> " + name)
        let note = null
        let itemsJsonObj = []

        let clabel = lastName
        let parentNode = val.parentNode
        if (parentNode.nodeName.toLowerCase() == 'section') {
          let idAttr = parentNode.getAttribute("id")
          if (idAttr != null) {
            let labelToBe = firstLetterUpper(idAttr)
            clabel = labelToBe
          } else {
            clabel = null
          }
        }

        let prevSib = val.previousElementSibling
        if (prevSib.nodeName.toLowerCase() != 'h3') {
          if (note === null) note = ''
          let txtNote = processTagsAsText(prevSib)
          if (txtNote != null) {
            note += txtNote.trim()
          }
          prevSib = prevSib.previousElementSibling
        }
        let name = prevSib.innerHTML // its the h3 as title

        // Get an HTML list ID.
        var checklistId = $(this).attr('id') || '_checklist_' +  index + '_';
        
        $(this).find('>li').each(function(index_li, val_li) {
          let item = {}
          //console.log("xxxxx!  " + val.children[0].innerHTML);
          // item["checklist_name"] = val.children[0].children[0].innerHTML
          // item["checked"] = $(this).attr('data-checked').innerHTML

          $(this).find('>label > input').each(function(index_input, val_input) {
            let ns = val_input.nextSibling
            // console.log("-----!  " + (ns.innerText || ns.textContent));
            //item["item_name"] = firstLetterUpper((ns.innerText || ns.textContent))
            //item["item_name"] = (processTagsAsText(ns) ?? 'nuuul')
            item["item_name"] = ''

            let nss = ns // ns.nextSibling
            while (nss != null) {
              if (nss.nodeName.toLowerCase() == 'div') {
                if (!nss.classList.contains('note')){
                  item["action"] = firstLetterUpper((nss.textContent).trim())
                }
                else {
                  let txtNote = processTagsAsText(nss)
                  if (txtNote != null) {
                    item["note"] = txtNote.trim()
                  }
                }
              } else {
                let txt = processTagsAsText(nss)
                if (txt != null) {
                  item["item_name"] += txt
                }
              }
              nss = nss.nextSibling
            }

            item["item_name"] = firstLetterUpper(item["item_name"].trim())
            item["checked"] = val_input.checked
          });

          itemsJsonObj.push(item)
        });

        let clJsonData = {}
        clJsonData["checklist_name"] = firstLetterUpper(name)
        if (clabel != null) clJsonData["label"] = clabel
        if (note != null) clJsonData["note"] = note.trim()
        clJsonData["items"] = itemsJsonObj

        checklistListJson.push(clJsonData)
      });

      let jsonData = {}
      jsonData["group_name"] = lastName
      jsonData["label"] = gname
      if (noteCheck != null) jsonData["note"] = noteCheck.trim()
      jsonData["checklists"] = checklistListJson

      let dataStr = JSON.stringify(jsonData, null, '  ');
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
      let exportFileDefaultName = fileName.replace('/', '_')+'.json';
  
      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
  }

  function extractFileNameAndGroupNameAndLabel() {
    let href = window.location.pathname
    href = href.replace('missions/','').replace('preparation/','').replace('.html','')
    let paths = href.split("/")
    paths.shift()
    for(let i = 0; i < paths.length; i++) {
      paths[i] = firstLetterUpper(paths[i])
    }
    let fileName = paths.join('/')
    let lastName = decodeURI(paths[paths.length - 1]).replace(/[_-]/g, ' ')
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

    return [fileName, lastName.trim(), gname.trim()]
  }

  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  function firstLetterUpper(theString) {
    var newString = theString.replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){return c.toUpperCase()});
    return newString;
  }
  
  function processTagsAsText(node) {
    //let nd = node.firstChild
    let retTxt = null
    if (node.nodeType === Node.TEXT_NODE) {
      retTxt = ((node.innerText || node.textContent) ?? '')
    }
    for (let nd of node.childNodes) {
      if (nd == null) continue

      if (retTxt == null) retTxt = ''

      // if (nd.nodeType === Node.TEXT_NODE) {
      //   retTxt += (nd.textContent ?? '').trim()
      //   continue
      // }

      switch (nd.nodeName.toLowerCase()) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'div':
        case 'p':
          retTxt += '\n' + (processTagsAsText(nd) ?? '') + '\n'
          break;

        case 'br':
          retTxt += '\n'
          break;

        case 'ul':
        case 'ol':
          retTxt += '\n ' + (processTagsAsText(nd) ?? '') + '\n'
          break

        case 'li':
          retTxt += '\n - ' + (processTagsAsText(nd) ?? '')
          break

        case 'a':
          retTxt += (processTagsAsText(nd) ?? '') + ' ' + (nd.getAttribute('href') ?? '')
          break

        case 'i':
        case 'em':
            retTxt += '*' + (processTagsAsText(nd) ?? '') + '*'
          break

        case 'b':
        case 'strong':
              retTxt += '**' + (processTagsAsText(nd) ?? '') + '**'
            break

        case 'cite':
              retTxt += '`' + (processTagsAsText(nd) ?? '') + '`'
            break

        default:
          if (nd.nodeType === Node.TEXT_NODE)
            retTxt += (nd.innerText || nd.textContent)
          else
            retTxt += (nd.textContent ?? '')
          break;
      }
    }

    return retTxt
  }
}();
