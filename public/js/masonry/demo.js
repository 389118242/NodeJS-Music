
$(function(){
  var TILE_IDS = [
    1, 2, 3, 4, 5, 6
  ];
  var rows;
  var rows_lg = [
    " A A B . C ",
    " A A B . C "
  ];
  var rows_sm = [
                 " A A B . C ",
                 " A A B . C "
               ];
  var rows_xs = [
                 " A A B . C ",
                 " A A B . C "
               ];

  var el = $('#masonry'),
  grid = new Tiles.Grid(el);
  grid.cellPadding = 0;
  grid.animationDuration = 0;

  grid.resizeColumns = function() {
      return this.template.numCols;
  };
  grid.numCols = function() {
      return this.template.numRows;
  };

  grid.createTile = function(tileId) {
      var tile = new Tiles.Tile(tileId);
      tile.$el.attr('tile-id', tileId).addClass('pos-abt').append($( " > .item:first", el ));
      return tile;
  };

  // get the rows json for different screen
  var $window = $(window);
  var getRows = function(){
    var $rows;
    $window.width() < 768 && ($rows = rows_xs);
    $window.width() >= 768 && ($rows = rows_sm);
    $window.width() >= 992 && ($rows = rows_lg);
    return $rows;
  };

  grid.template = Tiles.Template.fromJSON(getRows());
  grid.isDirty = true;
  grid.resize();

  var ids = TILE_IDS.slice(0, grid.template.rects.length);
  grid.updateTiles(ids);
  grid.redraw(true);

  // set height on mobile
  var setHeight = function(){
    el.height('auto');
    $window.width() < 768 && el.height(grid.cellSize * grid.template.numRows);
  }
  setHeight();

  // resize the window
  var $resize, $width = $window.width();
  $window.resize(function() {
    if($width !== $window.width()){
      clearTimeout($resize);
      $resize = setTimeout(function(){      
        grid.template = Tiles.Template.fromJSON(getRows());
        grid.resize();
        grid.redraw(true);
        setHeight();
        $width = $window.width();
      }, 200);
    }
  });

});