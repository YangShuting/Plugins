;(function($, window, document, undefined){
  
  var pluginName = 'treeview';
  var _default = {

  }

  _default.settings = {

    injectStyle: true,

    levels: 2,

    expandIcon: 'glyphicon glyphicon-plus',
    collapseIcon: 'glyphicon glyphicon-minus',
    emptyIcon: 'glyphicon'
  };

  _default.searchOptions = {
    ignoreCase: true,
    exactMatch: false,
    revealResults: true
  };

  var Tree = function(element, options){
    this.$element = $(element);
    this.elmentId = element.id;
    this.styleId = this.elmentId+ '-style';
    this.init(options);
    return{

    }
  }

  Tree.prototype.init = function (options){
    this.tree = [];
    this.nodes = [];
    this.tree = $.extend(true, [], options.data);
    delete options.data;
    this.options = $.extend(true, _default.settings, options); 
    this.setInitialStates({nodes: this.tree}, 0);
    this.render();
  }

  Tree.prototype.setInitialStates = function(node, level){
    if(!node) return;
    level+=1;
    var _this = this;
    $.each(node.nodes, function checkState(index, node){
       node.state = node.state || {};
       if(!node.state.hasOwnProperty('disable')){
        node.state.disable = false;
       }
       if(!node.state.hasOwnProperty('expanded')){
        if(!node.state.disable && 
                 (level < _this.options.levels) &&
                 (node.nodes && node.nodes.length > 0)){
          node.state.expanded = true;
        }
        else{
          node.state.expanded = false;
        }
        
       }
       _this.nodes.push(node);
       if(node.nodes){
         _this.setInitialStates(node, level);
       }
    });
  }
  Tree.prototype.render = function(){
    if(!this.initialized){
    	this.$element.addClass(pluginName);
    	this.$wrapper = $(this.template.list);
      this.injectStyle();
    	this.initialized = true;

    }
    this.buildTree(this.tree, 0);
  }
  Tree.prototype.injectStyle = function(){
    if(this.options.injectStyle && !document.getElementById(this.styleId)){
      $('<style type="text/css" id="">'+this.buildStyle()+'</style>').appendTo('head');
    }
  }
  Tree.prototype.buildStyle = function(){
    return this.css;
  }
  Tree.prototype.css = '.treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.icon{width:12px;margin-right:5px}.treeview .node-disabled{color:silver;cursor:not-allowed}'
  Tree.prototype.buildTree = function(nodes, level){
    if(!nodes) return;
    level+=1;

    var _this = this;
    $.each(nodes, function addNotes(id, node){
       var treeItem = $(_this.template.item)
       .attr('data-nodeid', '');
       for(var i = 0; i< (level - 1);i++){
       	treeItem.append(_this.template.indent);
       }

       var classList = [];
       if(node.nodes){
       	classList.push('expand-icon ');
        if(node.state.expanded){
          classList.push(_this.options.collapseIcon);
        }
        else{
          classList.push(_this.options.expandIcon);
        }
       }
       else{
       	classList.push(_this.options.emptyIcon);
       }
       _this.$element.append(_this.$wrapper);
       treeItem.append($(_this.template.icon).addClass(classList.join('')));
       treeItem.append(node.text);
       _this.$wrapper.append(treeItem);
       if(node.nodes){
        _this.buildTree(node.nodes, level);
       }
    });
  }

  Tree.prototype.template = {
  	list: '<ul class="list-group"></ul>',
  	item: '<li class="list-group-item"></li>',
  	indent: '<span class="indent"></span>',
  	icon: '<span class="icon"></span>',
  	link: '<a href="#" style="color:inherit"></a>',
  	badge: '<span class="badge"></span>'
  }

  $.fn[pluginName] = function(options){
    $.data(this, pluginName, new Tree(this, $.extend(true, {}, this, options)));
  }

})(jQuery, window, document)