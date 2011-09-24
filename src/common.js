var U_Id_Seq = 0;
/**
 * Generates a unique (for this page) sequence id
 */
function U_gen_id() {
  return ++U_Id_Seq;
}

function U_debugPoint(x, y, color) {
  var buffer = [];

  buffer.push('<div id="dbgPt');
  buffer.push(U_gen_id());
  buffer.push('" style="background: ');
  buffer.push(color || 'yellow');
  buffer.push('; width: 15px; height: 15px; z-index: 99999; position: absolute; top: ');
  buffer.push(y);
  buffer.push('px; left: ');
  buffer.push(x);
  buffer.push('px;">');
  buffer.push('</div>');

  $(document.body).append(buffer.join(''));
}


/**
 * Measure the distance between 2 points
 */
function U_distance_2d(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

/**
 * Measure the distance between 2 points
 */
function U_angle_2d(x, y, x0, y0){
  //TODO
    return null;
};